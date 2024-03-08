import { DataTypes, Sequelize } from "sequelize";
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
  EventModel.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(50000),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ticketPurchaseDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    { sequelize, tableName: "event", modelName: "Event" }
  );

  EventModel.associate = (db: DbModel) => {
    EventModel.belongsToMany(db["Category"], {
      through: EventCategoryModel,
      foreignKey: "eventId",
      onDelete: ON_DELETE_EVENTS.CASCADE,
      as: "categories",
    });
    EventModel.hasMany(db["EventGallery"], { foreignKey: "eventId", onDelete: ON_DELETE_EVENTS.CASCADE, as: "gallery" });
    EventModel.belongsTo(db["User"], { foreignKey: "userId", onDelete: ON_DELETE_EVENTS.SET_NULL, as: "user" });
    EventModel.hasMany(db["Ticket"], { foreignKey: "eventId", onDelete: ON_DELETE_EVENTS.CASCADE, as: "tickets" });
  };

  return EventModel;
}
