import type { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  if (error instanceof AppError) {
    const details = {
      ...(error.details.params || {}),
      ...(error.details.body || {}),
      ...(error.details.errors || {}),
    };
    res.status(error.statusCode).send({ message: error.message, details });
  } else {
    res.status(500).send(error.message);
  }
};

export default errorHandler;
