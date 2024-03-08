import { Router } from "express";
import ticketRoutes from "./tickets.routes";

const router = Router();

router.use("/", ticketRoutes);

export default router;
