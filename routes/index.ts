import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import eventRoutes from "./event";
import ticketRoutes from "./tickets";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/event", eventRoutes);
routes.use("/ticket", ticketRoutes);

export default routes;
