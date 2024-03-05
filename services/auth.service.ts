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

async function auth(user: UserModel): Promise<AuthResponse> {
  const accessToken = await jwtHelper.sign(user.id);

  return { user, accessToken };
}

async function findOrCreateToken(data: FindOrCreateTokenDTO) {
  const dbToken = await TokenModel.findOne({ where: { email: data.email, type: data.type } });

  if (dbToken) {
    dbToken.token = data.token;
    dbToken.code = data.code;
    return await dbToken.save();
  } else {
    return await TokenModel.create({ ...data });
  }
}

export async function register(data: RegisterDTO) {
  const { firstName, lastName, email, password } = data;

  const dbAuth = await AuthModel.findOne({ where: { email } });
  if (dbAuth) throw new ServiceException(400, "A user with this email already exists");

  await UserModel.create({ firstName, lastName, email });
  await AuthModel.create({ email, password });
  const token = v4();
  const code = Math.floor(Math.random() * 999999999);
  const link = `${secrets.frontendUrl}/verify-email/${code}/${token}`;
  await findOrCreateToken({ email, token, code, type: TokenType.accountVerificationToken });

  await sendMail({
    to: email,
    subject: "VERIFY ACCOUNT",
    html: renderTemplate("verify-account.ejs", { link }),
  });
}

export async function verifyAccount(data: VerifyAccountDTO) {
  const { token, code } = data;

  const dbToken = await TokenModel.findOne({
    where: {
      value: token,
      code,
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
