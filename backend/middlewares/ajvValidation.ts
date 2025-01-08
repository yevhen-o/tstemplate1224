import { RequestHandler } from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv();
addFormats(ajv);
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
