import { Op } from "sequelize";
import { uploadResource } from "../helpers/upload.helper";
import { sequelize } from "../models";
import { EventCategoryModel } from "../models/event-category.model";
import { EventGalleryModel } from "../models/event-gallery.model";
import { EventModel } from "../models/event.model";
import { CreateEventDTO, GetEventsDTO, UpdateEventDTO } from "../schema/dto/event.dto";
import ServiceException from "../schema/exceptions/service.exception";
import { PaginatedResponse } from "../schema/dto/pagination.dto";
import { UserModel } from "../models/user.model";
import { isBefore, startOfToday } from "date-fns";
import { CategoryModel } from "../models/category.model";
import { validateEvent } from "../helpers/event.helper";
import { PurchasedTicketModel } from "../models/purchased-ticket.model";

export async function createEvent({ categories, gallery, ...data }: CreateEventDTO) {
  const transaction = await sequelize.transaction();

  await validateEvent(data);

  try {
    const event = await EventModel.create(data, { transaction });

    const eventGallery = await Promise.all(
      gallery.map(async (gallery) => {
        const { url, public_id } = await uploadResource(gallery.url);

        return { ...gallery, url, urlId: public_id, eventId: event.id };
      })
    );
    await EventGalleryModel.bulkCreate(eventGallery, { transaction });

    const eventCategories = categories.map((category) => ({ categoryId: category, eventId: event.id }));
    await EventCategoryModel.bulkCreate(eventCategories, { transaction });

    await transaction.commit();

    return event;
  } catch (error: any) {
    await transaction.rollback();
    throw new ServiceException(500, error.message || error);
  }
}

export async function getEvents(data: GetEventsDTO): Promise<PaginatedResponse<EventModel>> {
  const page = parseInt(data.page);
  const limit = parseInt(data.limit);

  let searchQuery = {};

  if (data.search) {
    searchQuery = {
      [Op.or]: [
        {
          name: { [Op.iLike]: `%${data.search}%` },
        },
        {
          description: { [Op.iLike]: `%${data.search}%` },
        },
      ],
    };
  }

  const { rows, count } = await EventModel.findAndCountAll({
    offset: (page - 1) * limit,
    limit,
    where: {
      ...searchQuery,
      ticketPurchaseDeadline: { [Op.gte]: startOfToday() },
    },
    order: [
      ["createdAt", "ASC"],
      ["startDate", "ASC"],
    ],
    include: [
      { model: EventGalleryModel, as: "gallery" },
      { model: UserModel, as: "user" },
    ],
  });

  return { data: rows, total: count, page, limit };
}

export async function getUserCreatedEvents(userId: number, data: GetEventsDTO): Promise<PaginatedResponse<EventModel>> {
  const page = parseInt(data.page);
  const limit = parseInt(data.limit);

  const { rows, count } = await EventModel.findAndCountAll({
    offset: (page - 1) * limit,
    limit,
    where: {
      userId,
    },
    order: [
      ["createdAt", "ASC"],
      ["startDate", "ASC"],
    ],
    include: [
      { model: EventGalleryModel, as: "gallery" },
      { model: UserModel, as: "user" },
    ],
  });

  return { data: rows, total: count, page, limit };
}

export async function getEvent(eventId: number) {
  const event = await EventModel.findByPk(eventId, {
    include: [
      { model: CategoryModel, as: "categories" },
      { model: EventGalleryModel, as: "gallery" },
      { model: UserModel, as: "user" },
    ],
  });

  if (!event) throw new ServiceException(404, "Event does not exist");

  return event;
}

export async function deleteEvent(eventId: number) {
  const purchasedTickets = await PurchasedTicketModel.findAll({ where: { eventId } });

  if (purchasedTickets.length > 0) throw new ServiceException(400, "cannot delete with more than one purchased tickets");

  await EventModel.destroy({ where: { id: eventId } });
}

export async function updateEvent({ eventId, ...data }: UpdateEventDTO) {
  await validateEvent(data);

  await EventModel.update({ ...data }, { where: { id: eventId } });
}

export async function getEventProfit(eventId: number) {
  const profit = await PurchasedTicketModel.sum("amount", { where: { eventId } });

  return profit;
}
