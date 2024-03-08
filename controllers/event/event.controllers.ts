import { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { CreateEventDTO, GetEventsDTO, UpdateEventDTO } from "../../schema/dto/event.dto";
import { createEvent, deleteEvent, getEvent, getEvents, getUserCreatedEvents, updateEvent } from "../../services/event.service";

export const createEventController = expressAsyncHandler(async (req: Request<{}, {}, CreateEventDTO>, res) => {
  const userId = req.userId as number;

  const data = await createEvent({ ...req.body, userId });

  res.status(201).json(data);
});

export const getEventsController = expressAsyncHandler(async (req, res) => {
  const data = await getEvents({ ...req.query } as any);

  res.status(200).json(data);
});

export const getUserCreatedEventsController = expressAsyncHandler(async (req, res) => {
  const userId = req.userId as number;

  const data = await getUserCreatedEvents(userId, { ...(req.query as any) });

  res.status(200).json(data);
});

export const getEventController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const eventId = parseInt(req.params.id);

  const data = await getEvent(eventId);

  res.status(200).json(data);
});

export const deleteEventController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const eventId = parseInt(req.params.id);

  await deleteEvent(eventId);

  res.status(200).json({ message: "event deleted" });
});

export const updateEventController = expressAsyncHandler(async (req: Request<{ id: string }, {}, UpdateEventDTO>, res) => {
  const eventId = parseInt(req.params.id);

  await updateEvent({ ...req.body, eventId });

  res.status(200).json({ message: "event updated" });
});
