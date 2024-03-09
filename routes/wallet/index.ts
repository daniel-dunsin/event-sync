import { Router } from "express";
import router from "../auth";
import authenticate from "../../middlewares/auth.middleware";
import walletRoutes from "./wallet.routes";

const rotuer = Router();

router.use("/wallet", authenticate, walletRoutes);

export default router;
