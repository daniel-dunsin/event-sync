import expressAsyncHandler from "express-async-handler";
import { AccountLookupDTO, InitiateTransactionDTO, PurchaseTicketDTO, WebhookResponse } from "../../schema/dto/payment.dto";
import { Request } from "express";
import { purchaseTicket } from "../../services/ticket.service";
import { accountLookup, getBanks, handleWebhook } from "../../services/payment.service";
import { validateWebhookSignature } from "../../helpers/payment.helper";

export const purchaseTicketController = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, PurchaseTicketDTO>, res, next) => {
    const userId = req.userId as number;
    const ticketId = parseInt(req.params.id);

    const data = await purchaseTicket({ ...req.body, userId, ticketId });

    const response = typeof data === "string" ? { checkout_url: data } : data;

    res.status(201).json(response);
  }
);

export const handleWebhookController = expressAsyncHandler(async (req: Request<{}, {}, WebhookResponse>, res) => {
  await validateWebhookSignature(JSON.stringify(req.body), req.headers["x-squad-encrypted-body"] as string);

  await handleWebhook(req.body);

  res.status(200).json({ message: "webhook don run" });
});

export const getBanksController = expressAsyncHandler(async (req: Request<{}, {}, {}, { search: string }>, res) => {
  const data = await getBanks(req.query.search);

  res.status(200).json(data);
});

export const accountLookupController = expressAsyncHandler(async (req: Request<{}, {}, AccountLookupDTO>, res) => {
  const data = await accountLookup(req.body);

  res.status(200).json(data);
});
