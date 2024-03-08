import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validator.middleware";
import { createTicketsInput, updateTicketInput } from "../../schema/validators/ticket.validator";
import {
  createTicketsController,
  deleteTicketController,
  getTicketController,
  getTicketsController,
  updateTicketController,
} from "../../controllers/tickets/tickets.controllers";

const ticketRoutes = Router();

ticketRoutes.post("/event/:id", authenticate, validate(createTicketsInput), createTicketsController);

ticketRoutes.get("/event/:id", getTicketsController);

ticketRoutes.get("/:id", getTicketController);

ticketRoutes.put("/:id", authenticate, validate(updateTicketInput), updateTicketController);

ticketRoutes.delete("/:id", deleteTicketController);

export default ticketRoutes;
