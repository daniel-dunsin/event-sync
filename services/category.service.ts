import slugify from "../helpers/slugify.helper";
import { CategoryModel } from "../models/category.model";
import { EventCategoryModel } from "../models/event-category.model";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../schema/dto/event.dto";
import ServiceException from "../schema/exceptions/service.exception";

export async function createCategory(data: CreateCategoryDTO) {
  const slug = slugify(data.name);

  const category = await CategoryModel.findOne({ where: { slug } });

  if (category) return category;

  return await CategoryModel.create({ ...data, slug });
}

export async function getCategories() {
  return await CategoryModel.findAll();
}

export async function getSingleCategory(categoryId: number) {
  const category = await CategoryModel.findByPk(categoryId);

  if (!category) throw new ServiceException(404, "cannot find category");

  return category;
}

export async function deleteCategory(categoryId: number) {
  await CategoryModel.destroy({ where: { id: categoryId } });
  await EventCategoryModel.destroy({ where: { categoryId } });
}

export async function updateCategory({ id, ...data }: UpdateCategoryDTO) {
  const query: Partial<CategoryModel> = { ...data };

  if (data.name) {
    query.slug = slugify(data.name);
  }

  await CategoryModel.update(query, { where: { id } });
}
