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
