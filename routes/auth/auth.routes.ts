import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import {
  forgotPasswordInput,
  googleAuthInput,
  loginInput,
  registerInput,
  resetPasswordInput,
  verifyAccountInput,
} from "../../schema/validators/auth.validator";
import {
  forgotPasswordController,
  loginController,
  registerController,
  verifyAccountController,
  resetPasswordController,
  googleSignInController,
} from "../../controllers/auth/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", validate(registerInput), registerController);
authRoutes.post("/login", validate(loginInput), loginController);
authRoutes.post("/google", validate(googleAuthInput), googleSignInController);
authRoutes.post("/verify-account", validate(verifyAccountInput), verifyAccountController);
authRoutes.post("/forgot-password", validate(forgotPasswordInput), forgotPasswordController);
authRoutes.put("/reset-password", validate(resetPasswordInput), resetPasswordController);

export default authRoutes;
