import { Request, Response } from "express";
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { Organization, Token } from "./";

const db = require("../db_connect");

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         firstName:
 *           type: string
 *           default: James
 *         lastName:
 *           type: string
 *           default: Bond
 *         email:
 *           type: string
 *           default: james_bond@google.com
 *         password:
 *           type: string
 *           default: strongPassword123
 *         confirmPassword:
 *           type: string
 *           default: strongPassword123
 *         age:
 *           type: number
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: james_bond@google.com
 *         password:
 *           type: string
 *           default: strongPassword123
 *     UserResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *         accessToken:
 *           type: string
 *     UserListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           userId:
 *             type: number
 *           firstName:
 *             type: string
 *           age:
 *             type: number
 */

export const User = db.define(
  "user",
  {
    userId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

// User.sync({ force: true });

export type UserInterface = {
  userId: number;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationInterface = {
  organizationId: number;
  name: string;
  domain: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationUser = {
  role: string;
  createdAt: string;
  updatedAt: string;
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
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

function generateJwtUserAndTokens(user: UserWithOrganizations) {
  const { userId, organizations, firstName, lastName } = user;
  const jwtUser = {
    userId,
    firstName,
    lastName,
    roles: (organizations || []).map((org) => {
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
  const refreshToken = jwt.sign(jwtUser, process.env.REFRESH_TOKEN_SECRET);
  return { jwtUser, accessToken, refreshToken };
}

User.addRecord = async (req: Request, res: Response) => {
  const { password, confirmPassword, ...rest } = req.body;
  if (password !== confirmPassword) return res.status(400).send();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...rest, password: hashedPassword });
  const { jwtUser, accessToken, refreshToken } = generateJwtUserAndTokens(user);
  const { userId } = user;
  Token.addRecord(refreshToken, userId);
  res.cookie("token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({ ...jwtUser, accessToken });
};

User.getRecords = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: ["userId", "firstName", "age"],
  });
  res.send(users);
};

User.getRecord = async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { userId: req.params.userId },
    attributes: ["userId", "firstName", "lastName", "email", "age"],
  });
  res.send(user);
};

User.patchRecord = async (req: Request, res: Response) => {
  const user = await User.findOne({ where: { userId: req.params.userId } });
  await user.update(req.body);
  res.send(user);
};

User.removeRecord = async (req: Request, res: Response) => {
  await User.destroy({ where: { userId: req.params.userId } });
  res.status(204).send();
};

User.getUserOrganizations = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.userId, {
    attributes: ["userId", "firstName", "lastName", "email", "age"],
    include: Organization,
  });
  res.send(user.organizations);
};

User.getOwnedOrganizations = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.userId, {
    attributes: ["userId", "firstName", "lastName", "email", "age"],
    include: [{ model: Organization, as: "ownedOrganizations" }],
  });
  res.send(user.ownedOrganizations);
};

User.login = async (req: Request, res: Response) => {
  const user: UserWithOrganizations = await User.scope("withPassword").findOne({
    where: { email: req.body.email },
    include: Organization,
  });
  if (await bcrypt.compare(req.body.password, user.password)) {
    const { jwtUser, accessToken, refreshToken } =
      generateJwtUserAndTokens(user);
    const { userId } = user;
    Token.addRecord(refreshToken, userId);
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

User.logout = async (req: Request, res: Response) => {
  const token = req?.cookies?.token;
  if (token) {
    Token.removeRecord(token);
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

User.logoutAll = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (userId) {
    Token.revokeByUser(userId);
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

User.getNewAccessToken = async (req: Request, res: Response) => {
  const token = req?.cookies?.token;
  if (!token) return res.sendStatus(401);
  if (!Token.hasToken(token)) return res.sendStatus(403);
  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (err: Error, user: JwtUser) => {
      if (err) return res.sendStatus(403);
      delete user.iat;
      const accessToken = generateAccessToken(user);
      res.json({ ...user, accessToken: accessToken });
    }
  );
};
