import { uploadResource } from "../helpers/upload.helper";
import { sequelize } from "../models";
import { EventCategoryModel } from "../models/event-category.model";
import { EventGalleryModel } from "../models/event-gallery.model";
import { EventModel } from "../models/event.model";
import { CreateEventDTO } from "../schema/dto/event.dto";
import ServiceException from "../schema/exceptions/service.exception";

export async function createEvent({ categories, gallery, ...data }: CreateEventDTO) {
  const transaction = await sequelize.transaction();

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
