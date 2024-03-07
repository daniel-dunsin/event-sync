import { Router } from "express";
import eventRoutes from "./event.routes";

const router = Router();

router.use("/", eventRoutes);

export default router;
