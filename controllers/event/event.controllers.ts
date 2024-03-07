import { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { CreateEventDTO } from "../../schema/dto/event.dto";
import { createEvent } from "../../services/event.service";

export const createEventController = expressAsyncHandler(async (req: Request<{}, {}, CreateEventDTO>, res) => {
  const userId = req.userId as number;

  const data = await createEvent({ ...req.body, userId });

  res.status(201).json(data);
});
