import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import { purchaseTicketInput } from "../../schema/validators/payment.validate";
import { purchaseTicketController } from "../../controllers/payment/payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/purchase/ticket/:id", validate(purchaseTicketInput), purchaseTicketController);

export default paymentRoutes;
