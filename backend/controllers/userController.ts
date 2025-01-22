import jwt, { VerifyCallback } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, Organization } from "../models";

import {
  tokenAddRecord,
  tokenHasToken,
  tokenRemoveRecord,
  tokenRevokeByUser,
} from "./tokenController";

import { Request, Response } from "express";

import AppError from "../utils/AppError";

export type UserInterface = {
  userId: number;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationInterface = {
  organizationId: number;
  name: string;
  domain: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationUser = {
  role: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: number;
  userId: number;
};

export type UserWithOrganizations = UserInterface & {
  organizations: Array<
    OrganizationInterface & { organization_user: OrganizationUser }
  >;
};

export type JwtUser = {
  iat?: number;
  userId: number;
  firstName: string;
  lastName?: string;
  roles: {
    organizationId: number;
    domain: string;
    role: string;
  }[];
};

function generateAccessToken(user: JwtUser) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || "secret", {
    expiresIn: "30s",
  });
}

function generateJwtUserAndTokens(user: UserWithOrganizations | UserInterface) {
  const { userId, firstName, lastName } = user;
  const organizations =
    "organizations" in user && user.organizations ? user.organizations : [];

  const jwtUser = {
    userId,
    firstName,
    lastName,
    roles: organizations.map((org) => {
      const {
        organizationId,
        domain,
        organization_user: { role },
      } = org;
      return {
        organizationId,
        domain,
        role,
      };
    }),
  };
  const accessToken = generateAccessToken(jwtUser);
  const refreshToken = jwt.sign(
    jwtUser,
    process.env.REFRESH_TOKEN_SECRET || "secret"
  );
  return { jwtUser, accessToken, refreshToken };
}

export const userAddRecord = async (req: Request, res: Response) => {
  const { password, confirmPassword, ...rest } = req.body;
  if (password !== confirmPassword) return res.status(400).send();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...rest, password: hashedPassword });
  const { jwtUser, accessToken, refreshToken } = generateJwtUserAndTokens(user);
  const { userId } = user;
  tokenAddRecord(refreshToken, userId);
  res.cookie("token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return res.json({ ...jwtUser, accessToken });
};

export const userGetRecords = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: ["userId", "firstName", "age"],
  });
  res.send(users);
};

export const userGetRecord = async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { userId: req.params.userId },
    attributes: ["userId", "firstName", "lastName", "email", "age"],
  });
  res.send(user);
};

export const userPatchRecord = async (req: Request, res: Response) => {
  const user = await User.findOne({ where: { userId: req.params.userId } });
  if (!user) throw new AppError(req, "Bed request", 400);
  await user.update(req.body);
  res.send(user);
};

export const userRemoveRecord = async (req: Request, res: Response) => {
  await User.destroy({ where: { userId: req.params.userId } });
  res.status(204).send();
};

export const userGetUserOrganizations = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.userId, {
    attributes: ["userId", "firstName", "lastName", "email", "age"],
    include: Organization,
  });
  if (!user) throw new AppError(req, "Bed request", 400);
  res.send(user.organizations);
};

export const userGetOwnedOrganizations = async (
  req: Request,
  res: Response
) => {
  const user = await User.findByPk(req.params.userId, {
    attributes: ["userId", "firstName", "lastName", "email", "age"],
    include: [{ model: Organization, as: "ownedOrganizations" }],
  });
  if (!user) throw new AppError(req, "Bed request", 400);
  res.send(user.ownedOrganizations);
};

export const userLogin = async (req: Request, res: Response) => {
  const user = await User.scope("withPassword").findOne({
    where: { email: req.body.email },
    include: Organization,
  });
  if (!user) throw new AppError(req, "Bed request", 400);
  if (await bcrypt.compare(req.body.password, user.password)) {
    const { jwtUser, accessToken, refreshToken } =
      generateJwtUserAndTokens(user);
    const { userId } = user;
    tokenAddRecord(refreshToken, userId);
    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ ...jwtUser, accessToken });
  } else {
    res.status(400).send();
  }
};

export const userLogout = async (req: Request, res: Response) => {
  const token = req?.cookies?.token;
  if (token) {
    tokenRemoveRecord(token);
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(204).send();
  } else {
    res.status(400).send();
  }
};

export const userLogoutAll = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (userId) {
    tokenRevokeByUser(userId);
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(204).send();
  } else {
    res.status(400).send();
  }
};

export const userGetNewAccessToken = async (req: Request, res: Response) => {
  const token = req?.cookies?.token;
  if (!token) return res.status(401).send("Unauthorized");
  if (!tokenHasToken(token)) return res.status(403).send("Forbidden");

  const callback: VerifyCallback = (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");

    const user = decoded as JwtUser; // Safely cast to JwtUser
    delete user.iat;

    const accessToken = generateAccessToken(user);
    res.json({ ...user, accessToken });
  };

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "secret", callback);
};
