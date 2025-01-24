import { Todo } from "../models";

import { Request, Response } from "express";

import AppError from "../utils/AppError";

export const todoAddRecord = async (req: Request, res: Response) => {
  const todo = await Todo.create(req.body);
  res.send(todo);
};

export const todoGetRecords = async (req: Request, res: Response) => {
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

export const todoGetRecord = async (req: Request, res: Response) => {
  const todo = await Todo.findOne({ where: { uid: req.params.uid } });
  res.send(todo);
};

export const todoPatchRecord = async (req: Request, res: Response) => {
  const todo = await Todo.findOne({ where: { uid: req.params.uid } });
  if (!todo) throw new AppError(req, "Bed request", 400);
  await todo.update(req.body);
  res.send(todo);
};

export const todoRemoveRecord = async (req: Request, res: Response) => {
  const todo = await Todo.destroy({ where: { uid: req.params.uid } });
  res.status(204).send();
};
