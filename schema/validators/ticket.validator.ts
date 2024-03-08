import { array, number, object, string } from "yup";

export const createTicketsInput = object({
  body: array(
    object({
      type: string().required(),
      description: string().notRequired(),
      totalNumber: number().required().strict(),
      price: number().required().strict(),
    })
  ).required(),
});

export const updateTicketInput = object({
  body: object({
    type: string().required(),
    description: string().notRequired(),
    totalNumber: number().strict().required(),
  }),
});
