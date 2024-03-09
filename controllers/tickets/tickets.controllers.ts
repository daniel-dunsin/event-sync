import { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { CreateTicketDTO, UpdateTicketDTO } from "../../schema/dto/event.dto";
import { createTickets, deleteTicket, getTicket, getTickets, getTicketsStats, updateTicket } from "../../services/ticket.service";

export const createTicketsController = expressAsyncHandler(async (req: Request<{ id: string }, {}, CreateTicketDTO[]>, res) => {
  const eventId = parseInt(req.params.id);

  req.body = req.body.map((ticket) => ({ ...ticket, eventId }));

  const data = await createTickets(req.body);

  res.status(201).json(data);
});

export const getTicketsController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const eventId = parseInt(req.params.id);

  const data = await getTickets(eventId);

  res.status(200).json(data);
});

export const getTicketController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const ticketId = parseInt(req.params.id);

  const data = await getTicket(ticketId);

  res.status(200).json(data);
});

export const deleteTicketController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const ticketId = parseInt(req.params.id);

  await deleteTicket(ticketId);

  res.status(200).json({ message: "deleted" });
});

export const updateTicketController = expressAsyncHandler(async (req: Request<{ id: string }, {}, UpdateTicketDTO>, res) => {
  const ticketId = parseInt(req.params.id);

  await updateTicket({ ...req.body, id: ticketId });

  res.status(200).json({ message: "updated" });
});

export const getTicketsStatsController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const eventId = parseInt(req.params.id);

  const data = await getTicketsStats(eventId);

  res.status(200).json(data);
});
