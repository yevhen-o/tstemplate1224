import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postUserValidationSchema,
  patchUserValidationSchema,
} from "../validationSchemas";
import { User } from "../models";
import { tryCatch } from "../utils/tryCatch";

const router = Router();

/**
 * @openapi
 * '/users':
 *  post:
 *    tags:
 *    - User
 *    summary: Add new User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/users",
  ajvWrapper(postUserValidationSchema),
  tryCatch(User.addRecord)
);

/**
 * @openapi
 * '/users':
 *  get:
 *    tags:
 *    - User
 *    summary: Get list of users
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserListResponse'
 *      404:
 *        description: User not found
 */
router.get("/users", tryCatch(User.getRecords));

/**
 * @openapi
 * '/users/{userId}':
 *  get:
 *    tags:
 *    - User
 *    summary: Get single user by userId
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: The id of User
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *      404:
 *        description: User not found
 */
router.get("/users/:userId", tryCatch(User.getRecord));

/**
 * @openapi
 * '/users/{userId}':
 *  patch:
 *    tags:
 *    - User
 *    summary: Update single user by userId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: The id of User
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *      404:
 *        description: User not found
 */
router.patch(
  "/users/:userId",
  ajvWrapper(patchUserValidationSchema),
  tryCatch(User.patchRecord)
);

/**
 * @openapi
 * '/users/{userId}':
 *  delete:
 *    tags:
 *    - User
 *    summary: Delete single user by userId
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: The id of User
 *      required: true
 *    responses:
 *      204:
 *        description: Success
 *      404:
 *        description: User not found
 */
router.delete("/users/:userId", tryCatch(User.removeRecord));

/**
 * @openapi
 * '/users/{userId}/organizations':
 *  get:
 *    tags:
 *    - User
 *    summary: Get user list of organizations
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: The id of User
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationListResponse'
 *      404:
 *        description: User not found
 */
router.get("/users/:userId/organizations", tryCatch(User.getUserOrganizations));

/**
 * @openapi
 * '/users/{userId}/owned-organizations':
 *  get:
 *    tags:
 *    - User
 *    summary: Get user list of owned organizations
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: The id of User
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationListResponse'
 *      404:
 *        description: User not found
 */
router.get(
  "/users/:userId/owned-organizations",
  tryCatch(User.getOwnedOrganizations)
);

export default router;
