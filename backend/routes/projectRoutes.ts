import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postProjectValidationSchema,
  patchProjectValidationSchema,
} from "../validationSchemas";
import { Project } from "../models";
import { tryCatch } from "../utils/tryCatch";

const router = Router();

/**
 * @openapi
 * '/projects':
 *  post:
 *    tags:
 *    - Project
 *    summary: Add new Project
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateProjectInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/projectResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/projects",
  ajvWrapper(postProjectValidationSchema),
  tryCatch(Project.addRecord)
);

/**
 * @openapi
 * '/projects':
 *  get:
 *    tags:
 *    - Project
 *    summary: Get list of projects
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/projectListResponse'
 *      404:
 *        description: Project not found
 */
router.get("/projects", tryCatch(Project.getRecords));

/**
 * @openapi
 * '/projects/{projectId}':
 *  get:
 *    tags:
 *    - Project
 *    summary: Get single project by projectId
 *    parameters:
 *    - name: projectId
 *      in: path
 *      description: The id of Project
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProjectResponse'
 *      404:
 *        description: Project not found
 */
router.get("/projects/:projectId", tryCatch(Project.getRecord));

/**
 * @openapi
 * '/projects/{projectId}':
 *  patch:
 *    tags:
 *    - Project
 *    summary: Update single project by projectId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateProjectInput'
 *    parameters:
 *    - name: projectId
 *      in: path
 *      description: The id of Project
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProjectResponse'
 *      404:
 *        description: Project not found
 */
router.patch(
  "/projects/:projectId",
  ajvWrapper(patchProjectValidationSchema),
  tryCatch(Project.patchRecord)
);

/**
 * @openapi
 * '/projects/{projectId}':
 *  delete:
 *    tags:
 *    - Project
 *    summary: Delete single project by projectId
 *    parameters:
 *    - name: projectId
 *      in: path
 *      description: The id of Project
 *      required: true
 *    responses:
 *      204:
 *        description: Success
 *      404:
 *        description: Project not found
 */
router.delete("/projects/:projectId", tryCatch(Project.removeRecord));

export default router;
