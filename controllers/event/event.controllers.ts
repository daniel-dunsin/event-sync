import { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { CreateEventDTO, GetEventsDTO } from "../../schema/dto/event.dto";
import { createEvent, getEvents } from "../../services/event.service";

export const createEventController = expressAsyncHandler(async (req: Request<{}, {}, CreateEventDTO>, res) => {
  const userId = req.userId as number;

  const data = await createEvent({ ...req.body, userId });

  res.status(201).json(data);
});

export const getEventsController = expressAsyncHandler(async (req: Request, res) => {
  const data = await getEvents({ ...req.query } as any);

  res.status(200).json(data);
});
