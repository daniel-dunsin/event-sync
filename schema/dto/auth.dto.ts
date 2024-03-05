import { UserModel } from "../../models/user.model";
import { TokenType } from "../enums/token.enum";

export interface RegisterDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface FindOrCreateTokenDTO {
  email: string;
  code: number;
  token: string;
  type: TokenType;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserModel;
  accessToken: string;
}

export interface VerifyAccountDTO {
  token: string;
  code: string;
}

export interface ResetPasswordDTO {
  token: string;
  code: number;
  password: string;
}
