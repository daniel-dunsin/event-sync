import expressAsyncHandler from "express-async-handler";
import { InitiateTransactionDTO, PurchaseTicketDTO, WebhookResponse } from "../../schema/dto/payment.dto";
import { Request } from "express";
import { purchaseTicket } from "../../services/ticket.service";
import { handleWebhook } from "../../services/payment.service";

export const purchaseTicketController = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, PurchaseTicketDTO>, res, next) => {
    const userId = req.userId as number;
    const ticketId = parseInt(req.params.id);

    const checkout_url = await purchaseTicket({ ...req.body, userId, ticketId });

    res.status(201).json({ checkout_url });
  }
);

export const handleWebhookController = expressAsyncHandler(async (req: Request<{}, {}, WebhookResponse>, res) => {
  await handleWebhook(req.body);

  res.status(200).json({ message: "webhook don run" });
});
