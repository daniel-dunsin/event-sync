import { number, object } from "yup";

export const purchaseTicketInput = object({
  body: object({
    ticketsCount: number().strict().required(),
  }),
});
