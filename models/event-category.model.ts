import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { EventModel } from "./event.model";
import { CategoryModel } from "./category.model";
import { DbModel } from "../schema/types/db.type";

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
    EventCategoryModel.belongsTo(db["Event"], { foreignKey: "eventId" });
    EventCategoryModel.belongsTo(db["Category"], { foreignKey: "categoryId" });
  };

  return EventCategoryModel;
}
