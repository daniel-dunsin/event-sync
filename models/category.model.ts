import { DataTypes, Sequelize } from "sequelize";
import BaseModel from "./base";
import { DbModel } from "../schema/types/db.type";
import { EventModel } from "./event.model";
import { EventCategoryModel } from "./event-category.model";

export class CategoryModel extends BaseModel {
  declare name: string;
  declare description: string;
}

export default function init(sequelize: Sequelize): typeof CategoryModel {
  CategoryModel.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, tableName: "category", modelName: "Category" }
  );

  CategoryModel.associate = (db: DbModel) => {
    CategoryModel.belongsToMany(db["Event"], { through: EventCategoryModel, foreignKey: "categoryId" });
  };

  return CategoryModel;
}
