import { number, object, string } from "yup";

export const purchaseTicketInput = object({
  body: object({
    ticketsCount: number().strict().required(),
  }),
});

export const getBanksInput = object({
  query: object({
    search: string().required("search is required in query"),
  }),
});

export const accountLookupInput = object({
  body: object({
    account_number: string().required(),
    bank_code: string().required(),
  }),
});
