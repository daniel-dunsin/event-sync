import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import eventRoutes from "./event";
import ticketRoutes from "./tickets";
import paymentRoutes from "./payment";
import walletRoutes from "./wallet";
const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/event", eventRoutes);
routes.use("/ticket", ticketRoutes);
routes.use("/payment", paymentRoutes);
routes.use("/wallet", walletRoutes);

export default routes;
