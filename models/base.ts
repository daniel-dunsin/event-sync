import { Model, CreationOptional, Association } from "sequelize";
import { DbModel } from "../schema/types/db.type";

export default class BaseModel extends Model {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate: (db: DbModel) => void;
}
