import type { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .send({ message: error.message, details: error.details });
  } else {
    res.status(500).send(error.message);
  }
};

export default errorHandler;
