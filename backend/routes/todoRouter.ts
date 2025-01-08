import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postTodoValidationSchema,
  patchTodoValidationSchema,
} from "../validationSchemas";
import { Todo } from "../models/todos";
import { tryCatch } from "../utils/tryCatch";

const router = Router();

/**
 * @openapi
 * '/todos':
 *  post:
 *    tags:
 *    - Todo
 *    summary: Add new Todo
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateTodoInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/todos",
  ajvWrapper(postTodoValidationSchema),
  tryCatch(Todo.addRecord)
);

/**
 * @openapi
 * '/todos/':
 *  get:
 *    tags:
 *    - Todo
 *    summary: Get list of todos
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoListResponse'
 *      404:
 *        description: Todo not found
 */
router.get("/todos", tryCatch(Todo.getRecords));

/**
 * @openapi
 * '/todos/{todoId}':
 *  get:
 *    tags:
 *    - Todo
 *    summary: Get single todo by todoId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateTodoInput'
 *    parameters:
 *    - name: todoId
 *      in: path
 *      description: The id of Todo
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoResponse'
 *      404:
 *        description: Todo not found
 */
router.get("/todos/:uid", tryCatch(Todo.getRecord));

/**
 * @openapi
 * '/todos/{todoId}':
 *  patch:
 *    tags:
 *    - Todo
 *    summary: Update single todo by todoId
 *    parameters:
 *    - name: todoId
 *      in: path
 *      description: The id of Todo
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoResponse'
 *      404:
 *        description: Todo not found
 */
router.patch(
  "/todos/:uid",
  ajvWrapper(patchTodoValidationSchema),
  tryCatch(Todo.patchRecord)
);

export default router;
