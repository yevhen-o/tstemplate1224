import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postUserValidationSchema,
  patchUserValidationSchema,
  loginUserValidationSchema,
} from "../validationSchemas";
import { tryCatch } from "../utils/tryCatch";
import authenticateToken from "../middlewares/authenticateToken";
import {
  userAddRecord,
  userGetNewAccessToken,
  userGetOwnedOrganizations,
  userGetRecord,
  userGetRecords,
  userGetUserOrganizations,
  userLogin,
  userLogout,
  userLogoutAll,
  userPatchRecord,
  userRemoveRecord,
} from "../controllers/userController";

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
 *              $ref: '#/components/schemas/UserLoginResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/users",
  ajvWrapper(postUserValidationSchema),
  tryCatch(userAddRecord)
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
router.get("/users", tryCatch(userGetRecords));

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
router.get("/users/:userId", tryCatch(userGetRecord));

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
  tryCatch(userPatchRecord)
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
router.delete("/users/:userId", tryCatch(userRemoveRecord));

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
router.get("/users/:userId/organizations", tryCatch(userGetUserOrganizations));

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
  tryCatch(userGetOwnedOrganizations)
);

/**
 * @openapi
 * '/users/login':
 *  post:
 *    tags:
 *    - User
 *    summary: Login User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginUserInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLoginResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/users/login",
  ajvWrapper(loginUserValidationSchema),
  tryCatch(userLogin)
);

/**
 * @openapi
 * '/users/logout':
 *  post:
 *    tags:
 *    - User
 *    summary: Log out User
 *    responses:
 *      204:
 *        description: Success
 *      400:
 *        description: Bad request
 */
router.post("/users/logout", tryCatch(userLogout));

/**
 * @openapi
 * '/users/logout-all':
 *  post:
 *    tags:
 *    - User
 *    summary: Log out User from all devices
 *    responses:
 *      204:
 *        description: Success
 *      400:
 *        description: Bad request
 */
router.post("/users/logout-all", authenticateToken, tryCatch(userLogoutAll));

/**
 * @openapi
 * '/users/token':
 *  post:
 *    tags:
 *    - User
 *    summary: Get new access token
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLoginResponse'
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.post("/users/token", tryCatch(userGetNewAccessToken));

/**
 * @openapi
 * '/users/init':
 *  post:
 *    tags:
 *    - User
 *    summary: Get new access token
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLoginResponse'
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.post("/users/init", tryCatch(userGetNewAccessToken));

export default router;
