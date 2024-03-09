import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validator.middleware";
import {
  createEventController,
  deleteEventController,
  getEventController,
  getEventProfitController,
  getEventsController,
  getUserCreatedEventsController,
  updateEventController,
} from "../../controllers/event/event.controllers";
import { createEventInput, getEventsInput, updateEventInput } from "../../schema/validators/event.validator";
import { extractQuery } from "../../middlewares/query-extractor.middleware";

const eventRoutes = Router();

eventRoutes.post("/", authenticate, validate(createEventInput), createEventController);
eventRoutes.get("/", validate(getEventsInput), extractQuery, getEventsController);
eventRoutes.get("/user", authenticate, validate(getEventsInput), extractQuery, getUserCreatedEventsController);
eventRoutes.get("/:id", getEventController);
eventRoutes.delete("/:id", authenticate, deleteEventController);
eventRoutes.put("/:id", authenticate, validate(updateEventInput), updateEventController);
eventRoutes.get("/:id/profit", authenticate, getEventProfitController);

export default eventRoutes;
