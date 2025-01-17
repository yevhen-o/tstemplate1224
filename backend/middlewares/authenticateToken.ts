import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JwtUser } from "../models/users";

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
    res.status(401).send("Unauthorized: No token provided.");
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
    console.error("Token verification failed:", err);
    res.status(401).send("Forbidden: Invalid token.");
    return;
  }
};

export default authenticateToken;
