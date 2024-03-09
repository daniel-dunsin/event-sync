import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import walletRoutes from "./wallet.routes";

const router = Router();

router.use("/", authenticate, walletRoutes);

export default router;
