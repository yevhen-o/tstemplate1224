import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError";
import { JwtUser } from "../controllers/userController";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

const authenticateToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    next(new AppError({}, "Validation error", 401));
    return;
  }

  try {
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "default_secret"
    ) as JwtUser;

    req.user = user;
    next();
  } catch (err) {
    next(new AppError(err, "Forbidden: Invalid token.", 401));
    return;
  }
};

export default authenticateToken;
