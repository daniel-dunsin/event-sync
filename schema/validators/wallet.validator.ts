import { number, object, string } from "yup";

export const withdrawInput = object({
  body: object({
    amount: number().required(),
    account_number: string().required(),
    bank_code: string().required(),
    account_name: string().required(),
  }),
});
