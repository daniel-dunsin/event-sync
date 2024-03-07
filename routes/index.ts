import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import eventRoutes from "./event";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/event", eventRoutes);

export default routes;
