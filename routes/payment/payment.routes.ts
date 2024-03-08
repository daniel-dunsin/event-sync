import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import { purchaseTicketInput } from "../../schema/validators/payment.validate";
import { handleWebhookController, purchaseTicketController } from "../../controllers/payment/payment.controller";
import authenticate from "../../middlewares/auth.middleware";

const paymentRoutes = Router();

paymentRoutes.post("/purchase/ticket/:id", authenticate, validate(purchaseTicketInput), purchaseTicketController);
paymentRoutes.post("/webhook", handleWebhookController);

export default paymentRoutes;
