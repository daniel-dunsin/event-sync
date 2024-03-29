import { NextFunction, Request, Response } from "express";
import { DefaultQuery } from "../schema/dto/pagination.dto";

export function extractQuery(req: Request<{}, {}, {}, any>, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  req.query = { ...req.query, page, limit };

  return next();
}
