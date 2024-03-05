import { NextFunction, Request, Response } from "express";
import ServiceException from "../schema/exceptions/service.exception";

export function errorHandler(error: Error | ServiceException, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ServiceException) {
    return res.status(error.code).json({ error: error.message || error });
  }

  res.status(500).json({ error: error.message || error || "Internal Error Occured" });
}
