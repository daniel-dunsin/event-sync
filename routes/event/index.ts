import { Router } from "express";
import eventRoutes from "./event.routes";
import eventCategoryRoutes from "./event-category.routes";

const router = Router();

router.use("/", eventRoutes);
router.use("/category", eventCategoryRoutes);

export default router;
