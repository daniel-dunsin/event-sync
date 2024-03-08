import { v4 } from "uuid";
import { PaymentAttemptModel } from "../models/payment-attempt.model";
import { PurchasedTicketModel } from "../models/purchased-ticket.model";
import { WebhookResponse } from "../schema/dto/payment.dto";
import { PaymentStatus, WebhookEvents } from "../schema/enums/payment.enum";
import ServiceException from "../schema/exceptions/service.exception";
import { TicketModel } from "../models/ticket.model";
import { generateQrCode } from "../helpers/qrcode.helper";

export async function handleSuccessfulCharge(data: WebhookResponse) {
  /**
   * update the payment attempt status
   * generate a qr code with the userId and bookingId
   * create the purchased ticket
   * add the money to the event creator wallet
   */
  const paymentAttempt = await PaymentAttemptModel.findOne({
    where: {
      transaction_ref: data.Body.transaction_ref,
    },
  });
  if (!paymentAttempt) throw new ServiceException(404, "payment attempt no dey");
  paymentAttempt.status = PaymentStatus.SUCCESSFUL;
  await paymentAttempt.save();

  const ticket = await TicketModel.findByPk(paymentAttempt.ticketId);

  const bookingId = v4();
  const userId = paymentAttempt.userId;

  const qrCode = await generateQrCode({ bookingId, userId });

  await PurchasedTicketModel.create({
    bookingId,
    ticketId: paymentAttempt.ticketId,
    ticketsCount: paymentAttempt.ticketsCount,
    eventId: ticket?.eventId,
    userId,
    qrCode,
  });
  //  todo=> add money to user wallet
}

export async function handleWebhook(data: WebhookResponse) {
  switch (data.Event) {
    case WebhookEvents.CHARGE_SUCCESSFUL:
      await handleSuccessfulCharge(data);
      break;
    case WebhookEvents.CHARGE_FAILED:
      break;
    default:
      return "werey, your event no exist";
  }
}
