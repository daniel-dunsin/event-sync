import { FindOptions, ModelStatic } from "sequelize";
import { DbModel } from "../types/db.type";

export interface DefaultQuery {
  page: string | number;
  limit: string | number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationDTO extends DefaultQuery {
  model: ModelStatic<any> & { associate: (db: DbModel) => void };
  query: FindOptions;
}
