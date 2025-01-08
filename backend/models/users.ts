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
 *           firstName:
 *             type: string
 *           age:
 *             type: number
 */

export const User = db.define("user", {
  id: {
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
});

export type UserInterface = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
};

User.addRecord = async (req: Request, res: Response) => {
  console.log(req.body);
  const user = await User.create(req.body);
  console.log(user);
  res.send(user);
};

User.getRecords = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: ["firstName", "age"],
  });
  res.send(users);
};

User.getRecord = async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { uid: req.params.uid },
    attributes: ["firstName", "lastName", "email", "age"],
  });
  res.send(user);
};

User.patchRecord = async (req: Request, res: Response) => {
  const user = await User.findOne({ where: { uid: req.params.uid } });
  await user.update(req.body);
  res.send(user);
};
