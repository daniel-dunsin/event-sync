import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { EventModel } from "./event.model";
import { CategoryModel } from "./category.model";
import { DbModel } from "../schema/types/db.type";
import { ON_DELETE_EVENTS } from "../schema/enums/db.enum";

export class EventCategoryModel extends BaseModel {
  declare eventId: number;
  declare categoryId: number;
}

export default function init(sequelize: Sequelize): typeof EventCategoryModel {
  EventCategoryModel.init(
    {
      eventId: { type: DataTypes.BIGINT },
      categoryId: { type: DataTypes.BIGINT },
    },
    { sequelize, tableName: "event_category", modelName: "EventCategory" }
  );

  EventCategoryModel.associate = (db: DbModel) => {
    EventCategoryModel.belongsTo(db["Event"], { foreignKey: "eventId", onDelete: ON_DELETE_EVENTS.CASCADE });
    EventCategoryModel.belongsTo(db["Category"], { foreignKey: "categoryId", onDelete: ON_DELETE_EVENTS.CASCADE });
  };

  return EventCategoryModel;
}
