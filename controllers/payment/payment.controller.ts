import expressAsyncHandler from "express-async-handler";
import { InitiateTransactionDTO, PurchaseTicketDTO } from "../../schema/dto/payment.dto";
import { Request } from "express";
import { purchaseTicket } from "../../services/ticket.service";

export const purchaseTicketController = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, PurchaseTicketDTO>, res, next) => {
    const userId = req.userId as number;
    const ticketId = parseInt(req.params.id);

    const checkout_url = await purchaseTicket({ ...req.body, userId, ticketId });

    res.status(201).json({ checkout_url });
  }
);
