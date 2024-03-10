import { v4 } from "uuid";
import { TicketModel } from "../models/ticket.model";
import { CreateTicketDTO, UpdateTicketDTO } from "../schema/dto/event.dto";
import ServiceException from "../schema/exceptions/service.exception";
import { PaymentAttemptModel } from "../models/payment-attempt.model";
import { PurchaseTicketDTO } from "../schema/dto/payment.dto";
import { UserModel } from "../models/user.model";
import { initiateTransaction } from "../helpers/payment.helper";
import { PaymentStatus, WalletTransactionClerk, WalletTransactionStatus } from "../schema/enums/payment.enum";
import { CreatePurchasedTicketDTO } from "../schema/dto/ticket.dto";
import { generateQrCode } from "../helpers/qrcode.helper";
import { PurchasedTicketModel } from "../models/purchased-ticket.model";
import { sendMail } from "./email.service";
import { EventModel } from "../models/event.model";
import { renderTemplate } from "../helpers/email.helper";
import { WalletModel } from "../models/wallet.model";
import { createWalletTransaction } from "./wallet.service";

export async function createTickets(data: CreateTicketDTO[]) {
  return await TicketModel.bulkCreate(data as any);
}

export async function getTickets(eventId: number) {
  const tickets = await TicketModel.findAll({ where: { eventId }, order: [["price", "ASC"]] });

  return tickets;
}

export async function updateTicket({ id, ...data }: UpdateTicketDTO) {
  const ticket = await TicketModel.findByPk(id);

  if (!ticket) throw new ServiceException(404, "Ticket does not exist");

  if (ticket.totalSold > data.totalNumber) {
    throw new ServiceException(400, "new amount of tickets must not be less than amount of tickets previously sold");
  }

  await TicketModel.update({ ...data }, { where: { id } });
}

export async function deleteTicket(id: number) {
  const ticket = await TicketModel.findByPk(id);

  if (!ticket) throw new ServiceException(404, "Ticket does not exist");

  if (ticket?.totalSold > 0) throw new ServiceException(400, "cannot delete tickets that have already been purchased");

  await ticket.destroy();
}

export async function getTicket(id: number) {
  const ticket = await TicketModel.findByPk(id);

  if (!ticket) throw new ServiceException(404, "Ticket does not exist");

  return ticket;
}

export async function purchaseTicket(data: PurchaseTicketDTO) {
  const user = await UserModel.findByPk(data.userId);
  if (!user) throw new ServiceException(404, "user does not exist");

  const ticket = await TicketModel.findByPk(data.ticketId);
  if (!ticket) throw new ServiceException(404, "ticket does not exist");

  const ticketsAvailable = ticket.totalNumber - ticket.totalSold;
  if (data.ticketsCount > ticketsAvailable) throw new ServiceException(400, `Only ${ticketsAvailable} tickets are available`);

  const transaction_ref = v4();

  if (ticket.price == 0) {
    const attempt = await PaymentAttemptModel.create({
      transaction_ref,
      amount: 0,
      userId: data.userId,
      ticketId: data.ticketId,
      ticketsCount: data.ticketsCount,
      status: PaymentStatus.SUCCESSFUL,
    });

    const purchasedTicket = await createPurchasedTicket({ paymentAttemptId: attempt.id });
    return purchasedTicket;
  } else {
    const amount = data.ticketsCount * ticket.price * 100;
    const attempt = await PaymentAttemptModel.create({
      transaction_ref,
      amount,
      userId: data.userId,
      ticketId: data.ticketId,
      ticketsCount: data.ticketsCount,
    });

    const transaction = await initiateTransaction({
      customer_name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      amount,
      transaction_ref,
    });

    return transaction?.checkout_url;
  }
}

export async function createPurchasedTicket(data: CreatePurchasedTicketDTO) {
  /**
   * generate a qr code with the userId and bookingId
   * create the purchased ticket
   * send ticket to email
   * add the money to the event creator wallet
   */
  const paymentAttempt = await PaymentAttemptModel.findOne({ where: { id: data.paymentAttemptId } });
  if (!paymentAttempt) throw new ServiceException(404, "paymentAttempt does not exist");

  const ticket = await TicketModel.findByPk(paymentAttempt.ticketId);
  const bookingId = v4();
  const userId = paymentAttempt.userId;
  const amount = (ticket?.price as number) * paymentAttempt.ticketsCount;

  const qrCode = await generateQrCode({ bookingId, userId });

  const purchasedTicket = await PurchasedTicketModel.create({
    bookingId,
    ticketId: paymentAttempt.ticketId,
    ticketsCount: paymentAttempt.ticketsCount,
    eventId: ticket?.eventId,
    amount,
    userId,
    qrCode,
    paymentAttemptId: paymentAttempt.id,
  });

  const event = await EventModel.findByPk(ticket?.eventId);

  await TicketModel.increment({ totalSold: paymentAttempt.ticketsCount }, { where: { id: paymentAttempt.ticketId } });

  const user = await UserModel.findByPk(paymentAttempt.userId);
  await sendMail({
    to: user?.email,
    subject: `${ticket?.type?.toUpperCase()} ticket for ${event?.name}`,
    html: renderTemplate("ticket.ejs", { purchasedTicket, ticket, user, event }),
  });

  // add money to event creator wallet
  const userWallet = await WalletModel.findOne({ where: { userId } });

  await createWalletTransaction({
    amount,
    walletId: userWallet?.id,
    clerkType: WalletTransactionClerk.CREDIT,
    status: WalletTransactionStatus.SUCCESSFUL,
    reason: `Payment for ${ticket?.type?.toUpperCase()} ticket for ${event?.name}`,
  });

  return purchasedTicket;
}

export async function getTicketsStats(eventId: number) {
  const totalNumber = await TicketModel.sum("totalNumber", { where: { eventId } });
  const totalSold = await TicketModel.sum("totalSold", { where: { eventId } });

  return { totalNumber, totalSold };
}

export async function getEventTicketBuyers(eventId: number) {
  const buyers = await PurchasedTicketModel.findAll({
    where: { eventId },
    include: [{ model: UserModel, as: "user" }],
    attributes: ["ticketsCount"],
  });

  return buyers;
}
