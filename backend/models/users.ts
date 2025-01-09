import { Request, Response } from "express";
const Sequelize = require("sequelize");

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
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
};

User.addRecord = async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.send(user);
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
