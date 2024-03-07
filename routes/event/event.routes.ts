import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { createEventController } from "../../controllers/event/event.controllers";
import { createEventInput } from "../../schema/validators/event.validator";

const eventRoutes = Router();

eventRoutes.post("/", authenticate, validate(createEventInput), createEventController);

export default eventRoutes;
