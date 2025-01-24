import { Request } from "express";
import { JwtUser } from "../controllers/userController";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtUser;
    }
  }
}
