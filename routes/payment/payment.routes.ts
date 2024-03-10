import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import { purchaseTicketInput } from "../../schema/validators/payment.validate";
import {
  getBanksController,
  handleWebhookController,
  purchaseTicketController,
} from "../../controllers/payment/payment.controller";
import authenticate from "../../middlewares/auth.middleware";

const paymentRoutes = Router();

paymentRoutes.post("/purchase/ticket/:id", authenticate, validate(purchaseTicketInput), purchaseTicketController);
paymentRoutes.post("/webhook", handleWebhookController);
paymentRoutes.get("/banks", getBanksController);

export default paymentRoutes;
