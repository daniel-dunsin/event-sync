import { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { LoginDTO, RegisterDTO, ResetPasswordDTO, VerifyAccountDTO } from "../../schema/dto/auth.dto";
import { forgotPassword, login, register, resetPassword, verifyAccount } from "../../services/auth.service";

export const registerController = expressAsyncHandler(async (req: Request<{}, {}, RegisterDTO>, res) => {
  await register(req.body);

  res.status(201).json({ message: "verification email sent" });
});

export const loginController = expressAsyncHandler(async (req: Request<{}, {}, LoginDTO>, res) => {
  const data = await login(req.body);

  res.status(200).json(data);
});

export const verifyAccountController = expressAsyncHandler(async (req: Request<{}, {}, VerifyAccountDTO>, res) => {
  await verifyAccount(req.body);

  res.status(200).json({ message: "account verified successfully" });
});

export const forgotPasswordController = expressAsyncHandler(async (req: Request<{}, {}, { email: string }>, res) => {
  await forgotPassword(req.body.email);

  res.status(200).json({ message: "password reset email sent" });
});

export const resetPasswordController = expressAsyncHandler(async (req: Request<{}, {}, ResetPasswordDTO>, res) => {
  await resetPassword(req.body);

  res.status(200).json({ message: "password reset successful" });
});
