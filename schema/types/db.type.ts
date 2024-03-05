import { Model, ModelAttributes, ModelStatic } from "sequelize";

export type DbModel = {
  [modelName: string]: ModelStatic<any> & { associate: (db: DbModel) => void };
};
