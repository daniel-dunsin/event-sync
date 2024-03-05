import { object, string } from "yup";

export const registerInput = object({
  body: object({
    email: string().required().email(),
    firstName: string().required(),
    lastName: string().required(),
    password: string().required().min(8, "Password must not be less than 8 characters"),
  }),
});

export const loginInput = object({
  body: object({
    email: string().required().email(),
    password: string().required().min(8, "Password must not be less than 8 characters"),
  }),
});

export const googleAuthInput = object({
  body: object({
    accessToken: string().required(),
  }),
});

export const verifyAccountInput = object({
  body: object({
    token: string().required(),
    code: string().required(),
  }),
});

export const forgotPasswordInput = object({
  body: object({
    email: string().required().email(),
  }),
});

export const resetPasswordInput = object({
  body: object({
    password: string().required().min(8, "Password must not be less than 8 characters"),
    token: string().required(),
    code: string().required(),
  }),
});
