import { TicketModel } from "../models/ticket.model";
import { CreateTicketDTO, UpdateTicketDTO } from "../schema/dto/event.dto";
import ServiceException from "../schema/exceptions/service.exception";

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
