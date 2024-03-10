import { v4 } from "uuid";
import { PaymentAttemptModel } from "../models/payment-attempt.model";
import { PurchasedTicketModel } from "../models/purchased-ticket.model";
import { WebhookResponse } from "../schema/dto/payment.dto";
import { PaymentStatus, WebhookEvents } from "../schema/enums/payment.enum";
import ServiceException from "../schema/exceptions/service.exception";
import { TicketModel } from "../models/ticket.model";
import { generateQrCode } from "../helpers/qrcode.helper";
import { createPurchasedTicket } from "./ticket.service";
import slugify from "../helpers/slugify.helper";

export async function handleSuccessfulCharge(data: WebhookResponse) {
  /**
   * update the payment attempt status
   */
  const paymentAttempt = await PaymentAttemptModel.findOne({
    where: {
      transaction_ref: data.Body.transaction_ref,
    },
  });
  if (!paymentAttempt) throw new ServiceException(404, "payment attempt no dey");
  paymentAttempt.status = PaymentStatus.SUCCESSFUL;
  await paymentAttempt.save();

  await createPurchasedTicket({ paymentAttemptId: paymentAttempt.id });
}

export async function handleFailedCharge(data: WebhookResponse) {
  const paymentAttempt = await PaymentAttemptModel.findOne({
    where: {
      transaction_ref: data.Body.transaction_ref,
    },
  });
  if (!paymentAttempt) throw new ServiceException(404, "payment attempt no dey");
  paymentAttempt.status = PaymentStatus.FAILED;
  await paymentAttempt.save();
}

export async function handleWebhook(data: WebhookResponse) {
  switch (data.Event) {
    case WebhookEvents.CHARGE_SUCCESSFUL:
      await handleSuccessfulCharge(data);
      break;
    case WebhookEvents.CHARGE_FAILED:
      await handleFailedCharge(data);
      break;
    default:
      return "werey, your event no exist";
  }
}

export async function getBanks(search: string) {
  const filteredBanks = banks.filter((bank) => slugify(bank.name).includes(slugify(search)));

  return filteredBanks;
}
