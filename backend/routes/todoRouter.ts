import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postTodoValidationSchema,
  patchTodoValidationSchema,
} from "../validationSchemas";
import { Todo } from "../models/todos";

const router = Router();

router.post("/todos", ajvWrapper(postTodoValidationSchema), Todo.addRecord);

router.get("/todos", Todo.getRecords);

router.get("/todos/:uid", Todo.getRecord);

router.patch(
  "/todos/:uid",
  ajvWrapper(patchTodoValidationSchema),
  Todo.patchRecord
);

export default router;
