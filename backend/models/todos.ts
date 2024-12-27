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
    type: Sequelize.STRING,
    allowNull: true,
  },
  isCompleted: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

// Todo.sync({force: true});

Todo.addRecord = (title: string, deadline: string) => {
  const id = new Date().getTime();
  const options = {
    uid: id,
    title,
    deadline,
  };
  return Todo.create(options);
};

Todo.getRecords = async (req: Request, res: Response) => {
  const orgs = await Todo.findAll();
  res.send(orgs);
};

module.exports = Todo;
