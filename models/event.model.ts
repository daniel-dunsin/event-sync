import { Sequelize } from "sequelize";
import BaseModel from "./base";
import { DbModel } from "../schema/types/db.type";
import { CategoryModel } from "./category.model";
import { EventCategoryModel } from "./event-category.model";
import { EventGalleryModel } from "./event-gallery.model";
import { ON_DELETE_EVENTS } from "../schema/enums/db.enum";

export class EventModel extends BaseModel {
  declare name: string;
  declare description: string;
  declare startDate: Date;
  declare startTime: Date;
  declare endDate: Date;
  declare endTime: Date;
  declare addressLine1: string;
  declare addressLine2?: string;
  declare city: string;
  declare state: string;
  declare country: string;
  declare ticketPurchaseDeadline: Date;
  declare gallery: EventGalleryModel;
  declare userId: number;
}

export default function init(sequelize: Sequelize): typeof EventModel {
  EventModel.init({}, { sequelize, tableName: "event", modelName: "Event" });

  EventModel.associate = (db: DbModel) => {
    EventModel.belongsToMany(db["Category"], { through: EventCategoryModel, foreignKey: "eventId" });
    EventModel.hasMany(db["EventGallery"], { foreignKey: "eventId", onDelete: ON_DELETE_EVENTS.CASCADE });
    EventModel.belongsTo(db["User"], { foreignKey: "userId", onDelete: ON_DELETE_EVENTS.SET_NULL });
  };

  return EventModel;
}
