import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validator.middleware";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
} from "../../controllers/event/event-category.controller";
import { createCategoryInput, updateCategoryInput } from "../../schema/validators/event.validator";

const eventCategoryRoutes = Router();

eventCategoryRoutes.post("/", authenticate, validate(createCategoryInput), createCategoryController);
eventCategoryRoutes.get("/", getCategoriesController);
eventCategoryRoutes.put("/:id", authenticate, validate(updateCategoryInput), updateCategoryController);
eventCategoryRoutes.delete("/:id", authenticate, deleteCategoryController);
eventCategoryRoutes.get("/:id", getCategoryController);

export default eventCategoryRoutes;
