import { isBefore, startOfToday } from "date-fns";
import { CreateEventDTO, UpdateEventDTO } from "../schema/dto/event.dto";
import ServiceException from "../schema/exceptions/service.exception";
import { EventModel } from "../models/event.model";

export async function validateEvent(event: Pick<EventModel, "startDate" | "endDate" | "ticketPurchaseDeadline">) {
  if (isBefore(event.startDate, startOfToday())) {
    throw new ServiceException(400, "Start Date must be after today");
  }

  if (isBefore(event.endDate, event.startDate)) {
    throw new ServiceException(400, "End date has to be after start date");
  }

  if (isBefore(event.ticketPurchaseDeadline, startOfToday())) {
    throw new ServiceException(400, "Ticket purchase deadline must be after today");
  }
}
