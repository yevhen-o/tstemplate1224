import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postTodoValidationSchema,
  patchTodoValidationSchema,
} from "../validationSchemas";
import { Todo } from "../models/todos";
import { tryCatch } from "../utils/tryCatch";

const router = Router();

router.post(
  "/todos",
  ajvWrapper(postTodoValidationSchema),
  tryCatch(Todo.addRecord)
);

router.get("/todos", tryCatch(Todo.getRecords));

router.get("/todos/:uid", tryCatch(Todo.getRecord));

router.patch(
  "/todos/:uid",
  ajvWrapper(patchTodoValidationSchema),
  tryCatch(Todo.patchRecord)
);

export default router;
