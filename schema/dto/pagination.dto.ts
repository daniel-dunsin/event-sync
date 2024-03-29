import { FindOptions, ModelStatic } from "sequelize";
import { DbModel } from "../types/db.type";

export interface DefaultQuery {
  page: string;
  limit: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationDTO extends DefaultQuery, Omit<FindOptions, "limit"> {
  model: ModelStatic<any> & { associate: (db: DbModel) => void };
  where?: FindOptions["where"];
}
