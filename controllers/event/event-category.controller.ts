import { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../../schema/dto/event.dto";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
} from "../../services/category.service";

export const createCategoryController = expressAsyncHandler(async (req: Request<{}, {}, CreateCategoryDTO>, res) => {
  const data = await createCategory(req.body);

  res.status(201).json(data);
});

export const getCategoryController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const categoryId = parseInt(req.params.id);
  const data = await getSingleCategory(categoryId);

  res.status(200).json(data);
});

export const getCategoriesController = expressAsyncHandler(async (req, res) => {
  const data = await getCategories();

  res.status(200).json(data);
});

export const deleteCategoryController = expressAsyncHandler(async (req: Request<{ id: string }>, res) => {
  const categoryId = parseInt(req.params.id);
  await deleteCategory(categoryId);

  res.status(200).json({ message: "deleted" });
});

export const updateCategoryController = expressAsyncHandler(async (req: Request<{ id: string }, {}, UpdateCategoryDTO>, res) => {
  const categoryId = parseInt(req.params.id);
  await updateCategory({ ...req.body, id: categoryId });

  res.status(200).json({ message: "updated" });
});
