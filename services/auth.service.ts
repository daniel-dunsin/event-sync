import { v4 } from "uuid";
import { AuthModel } from "../models/auth.model";
import { UserModel } from "../models/user.model";
import {
  AuthResponse,
  FindOrCreateTokenDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  VerifyAccountDTO,
} from "../schema/dto/auth.dto";
import ServiceException from "../schema/exceptions/service.exception";
import { TokenType } from "../schema/enums/token.enum";
import { TokenModel } from "../models/token.model";
import secrets from "../constants/secrets.const";
import { sendMail } from "./email.service";
import { renderTemplate } from "../helpers/email.helper";
import jwtHelper from "../helpers/jwt.helper";
import crypto from "crypto";
import { google } from "googleapis";
import redisCache from "./cache.service";
import { createWallet } from "./wallet.service";
import { generate as generateOTP } from "otp-generator";

async function auth(user: UserModel): Promise<AuthResponse> {
  const accessToken = await jwtHelper.sign(user.id);

  return { user, accessToken };
}

async function findOrCreateToken(data: FindOrCreateTokenDTO) {
  const dbToken = await TokenModel.findOne({ where: { email: data.email, type: data.type } });

  if (dbToken) {
    dbToken.token = data.token;
    dbToken.code = data.code as number;
    return await dbToken.save();
  } else {
    return await TokenModel.create({ ...data });
  }
}

export async function register(data: RegisterDTO) {
  const { firstName, lastName, email, password } = data;

  const dbAuth = await AuthModel.findOne({ where: { email } });
  if (dbAuth) throw new ServiceException(400, "A user with this email already exists");

  const user = await UserModel.create({ firstName, lastName, email });
  await AuthModel.create({ email, password });
  const token = generateOTP(5, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

  await findOrCreateToken({ email, token, type: TokenType.accountVerificationToken });

  await createWallet(user.id);

  await sendMail({
    to: email,
    subject: "VERIFY ACCOUNT",
    html: renderTemplate("verify-account.ejs", { otp: token }),
  });
}

export async function verifyAccount(data: VerifyAccountDTO) {
  const { token } = data;

  const dbToken = await TokenModel.findOne({
    where: {
      token,
      type: TokenType.accountVerificationToken,
    },
  });

  if (!dbToken) throw new ServiceException(404, "Token is invalid/does not exist");

  const auth = await AuthModel.findOne({ where: { email: dbToken.email } });
  if (!auth) throw new ServiceException(404, "Account does not exist");
  if (auth.isVerified) throw new ServiceException(400, "User is already verified");

  auth.isVerified = true;
  await auth.save();
}

export async function login(data: LoginDTO) {
  const { email, password } = data;

  const user = await AuthModel.findOne({ where: { email } });

  if (!user) throw new ServiceException(404, "A user with this email does not exist");

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) throw new ServiceException(400, "Password is incorrect");

  const dbUser = await UserModel.findOne({ where: { email: user.email } });

  await redisCache.set(`user:${user.id}`, dbUser);

  return await auth(dbUser as UserModel);
}

export async function forgotPassword(email: string) {
  const user = await UserModel.findOne({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const code = Math.floor(Math.random() * 999999999);
    const link = `${secrets.frontendUrl}/reset-password/${code}/${token}`;
    await findOrCreateToken({ token, code, type: TokenType.passwordResetToken, email });

    await sendMail({
      to: email,
      subject: "FORGOT PASSWORD",
      html: renderTemplate("forgot-password.ejs", { link }),
    });
  }
}

export async function resetPassword(data: ResetPasswordDTO) {
  const { token, code, password } = data;

  await TokenModel.findOne({ where: { token, code, type: TokenType.passwordResetToken } }).then(async function (dbToken) {
    if (!dbToken) throw new ServiceException(404, "Token is invalid or has expired");

    await AuthModel.update({ password }, { where: { email: dbToken.email } });
  });
}

export async function verifyGoogleUser(accessToken: string): Promise<UserModel> {
  const oauthClient = new google.auth.OAuth2({
    clientId: secrets.google.clientId,
    clientSecret: secrets.google.clientSecret,
  });

  oauthClient.setCredentials({ access_token: accessToken });

  const oauth = google.oauth2({ auth: oauthClient, version: "v2" });

  // @ts-ignore
  return oauth.userinfo.get().then((user) => ({
    firstName: <string>user?.data?.given_name,
    lastName: <string>user?.data?.family_name,
    profilePicture: <string>user?.data?.picture,
    email: <string>user?.data?.email,
  }));
}

export const googleSignIn = async (accessToken: string): Promise<AuthResponse> => {
  return verifyGoogleUser(accessToken).then((userData) => {
    return UserModel.findOne({ where: { email: userData.email } }).then(async (user) => {
      if (user) {
        await redisCache.set(`user:${user.id}`, user);
        return auth(user);
      } else {
        await AuthModel.create({ email: userData.email, password: "", isVerified: true });
        user = await UserModel.create({ ...userData });
        await createWallet(user.id);
        await redisCache.set(`user:${user.id}`, user);
        return auth(user);
      }
    });
  });
};
