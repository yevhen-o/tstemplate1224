import { RequestHandler, Request, Response, NextFunction } from "express";

export const tryCatch =
  (
    controller: (req: Request, res: Response, next: NextFunction) => any
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
