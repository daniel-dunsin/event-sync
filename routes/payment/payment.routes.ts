import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import { accountLookupInput, getBanksInput, purchaseTicketInput } from "../../schema/validators/payment.validate";
import {
  accountLookupController,
  getBanksController,
  handleWebhookController,
  purchaseTicketController,
} from "../../controllers/payment/payment.controller";
import authenticate from "../../middlewares/auth.middleware";

const paymentRoutes = Router();

paymentRoutes.post("/purchase/ticket/:id", authenticate, validate(purchaseTicketInput), purchaseTicketController);
paymentRoutes.post("/webhook", handleWebhookController);
paymentRoutes.get("/banks", authenticate, validate(getBanksInput), getBanksController);
paymentRoutes.post("/account/lookup", authenticate, validate(accountLookupInput), accountLookupController);

export default paymentRoutes;
