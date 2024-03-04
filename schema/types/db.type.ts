import { Model, ModelAttributes } from "sequelize";

export type DbModel = {
  [modelName: string]: Model<ModelAttributes, any> & { associate: (db: DbModel) => void };
};
