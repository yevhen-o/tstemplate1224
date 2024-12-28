import { Request, Response } from "express";
const Sequelize = require("sequelize");

const db = require("../db_connect");

const Todo = db.define("todo", {
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

Todo.addRecord = (body: TodoInterface) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Todo.create(body)), 5000);
  });
};

Todo.getRecords = async (req: Request, res: Response) => {
  const todos = await Todo.findAll({
    attributes: ["uid", "title", "deadline"],
  });
  res.send(todos);
};

Todo.getRecord = async (req: Request, res: Response) => {
  const todo = await Todo.findOne({ where: { uid: req.params.uid } });
  res.send(todo);
};

module.exports = Todo;
