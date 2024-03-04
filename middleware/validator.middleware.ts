import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import ServiceException from "../schema/exceptions/service.exception";

export function validate(schema: AnySchema) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error: any) {
      throw new ServiceException(400, error.message || error);
    }
  };
}
