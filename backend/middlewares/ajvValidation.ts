import { RequestHandler } from "express";
import Ajv from "ajv";
const ajv = new Ajv();

import AppError from "../utils/AppError";

const ajvWrapper = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    try {
      const validate = ajv.compile(schema);
      const valid = validate(req.body);
      if (!valid) {
        next(new AppError(validate.errors, "Validation error", 400));
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

export default ajvWrapper;
