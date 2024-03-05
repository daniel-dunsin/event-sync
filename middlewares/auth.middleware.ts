import { NextFunction, Request, Response } from "express";
import ServiceException from "../schema/exceptions/service.exception";
import jwtHelper from "../helpers/jwt.helper";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new ServiceException(401, "provide auth header in this format => `Bearer ${accessToken}`");

    const token = authHeader.split(" ")[1];
    if (!token) throw new ServiceException(400, "provide token");

    const payload = await jwtHelper.verify(token);

    if (!payload.userId) throw new ServiceException(403, "unauthorized");

    req.userId = parseInt(payload.userId);

    return next();
  } catch (error) {
    return next(error);
  }
}
