import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import paymentRoutes from "./payment.routes";

const router = Router();

router.use("/", authenticate, paymentRoutes);

export default router;
