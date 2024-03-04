import { DbModel } from "../schema/types/db.type";
import BaseModel from "./base";
import { Sequelize } from "sequelize";

class UserModel extends BaseModel {
  declare name: string;
}

export default function init(sequelize: Sequelize) {
  UserModel.init({}, { sequelize, tableName: "users", modelName: "User" });

  UserModel.associate = (db: DbModel) => {};

  return UserModel;
}
