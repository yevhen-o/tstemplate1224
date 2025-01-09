import { Request, Response } from "express";
const Sequelize = require("sequelize");

const db = require("../db_connect");

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTodoInput:
 *       type: object
 *       required:
 *         - uid
 *         - title
 *       properties:
 *         uid:
 *           type: string
 *           default: someUniqString
 *         title:
 *           type: string
 *           default: Some nice todo to have done
 *         deadline:
 *           type: string
 *           default: Sun Dec 28 2025 00:00:00 GMT+0100 (Central European Standard Time)
 *         isCompleted:
 *           type: boolean
 *           default: false
 *         priority:
 *           type: string
 *           default: low
 *         isImportant:
 *           type: boolean
 *           default: true
 *         scope:
 *           type: string
 *           default: forFun
 *     TodoResponse:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *         title:
 *           type: string
 *         deadline:
 *           type: string
 *         isCompleted:
 *           type: boolean
 *         priority:
 *           type: string
 *         isImportant:
 *           type: boolean
 *         scope:
 *           type: string
 *         createdAt:
 *           type: boolean
 *         updatedAt:
 *           type: string
 *     TodoListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           uid:
 *             type: string
 *           title:
 *             type: string
 *           deadline:
 *             type: string
 *           priority:
 *             type: string
 *           isImportant:
 *             type: boolean
 *           scope:
 *             type: string
 */

export const Todo = db.define("todo", {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: Sequelize.STRING(10000),
    allowNull: false,
  },
  deadline: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  isCompleted: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  priority: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  isImportant: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  scope: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
});

//Todo.sync({ force: true });

export type TodoInterface = {
  uid: string;
  title: string;
  deadline: string;
  isCompleted: boolean;
  priority: string;
  isImportant?: boolean;
  scope: string;
};

Todo.addRecord = async (req: Request, res: Response) => {
  const todo = await Todo.create(req.body);
  res.send(todo);
};

Todo.getRecords = async (req: Request, res: Response) => {
  // await new Promise<void>((resolve) => {
  //   setTimeout(() => resolve(), 10000);
  // });
  const todos = await Todo.findAll({
    attributes: [
      "uid",
      "title",
      "deadline",
      "priority",
      "isImportant",
      "scope",
    ],
  });
  res.send(todos);
};

Todo.getRecord = async (req: Request, res: Response) => {
  const todo = await Todo.findOne({ where: { uid: req.params.uid } });
  res.send(todo);
};

Todo.patchRecord = async (req: Request, res: Response) => {
  const todo = await Todo.findOne({ where: { uid: req.params.uid } });
  await todo.update(req.body);
  res.send(todo);
};

Todo.removeRecord = async (req: Request, res: Response) => {
  const todo = await Todo.destroy({ where: { uid: req.params.uid } });
  res.status(204).send();
};
