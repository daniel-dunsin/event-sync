import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { createEventController, getEventsController } from "../../controllers/event/event.controllers";
import { createEventInput, getEventsInput } from "../../schema/validators/event.validator";
import { extractQuery } from "../../middlewares/query-extractor.middleware";

const eventRoutes = Router();

eventRoutes.post("/", authenticate, validate(createEventInput), createEventController);
eventRoutes.get("/", validate(getEventsInput), extractQuery, getEventsController);

export default eventRoutes;
