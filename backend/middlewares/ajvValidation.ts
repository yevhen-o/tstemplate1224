import { RequestHandler } from "express";
import Ajv from "ajv";
const ajv = new Ajv();

const ajvWrapper = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    try {
      const validate = ajv.compile(schema);
      const valid = validate(req.body);
      if (!valid) {
        res.status(400).send({
          message: validate.errors,
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).send({
        message: "something goes wrong",
      });
    }
  };
};

export default ajvWrapper;
