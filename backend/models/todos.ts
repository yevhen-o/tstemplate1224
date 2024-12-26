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
  duedate: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Organization.sync({force: true});

Todo.addRecord = (title: string, duedate: string) => {
  const id = new Date().getTime();
  const options = {
    uid: id,
    title,
    duedate,
  };
  return Todo.create(options);
};

Todo.getRecords = async (req: Request, res: Response) => {
  const orgs = await Todo.findAll();
  res.send(orgs);
};

module.exports = Todo;
