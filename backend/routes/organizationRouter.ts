import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postOrgValidationSchema,
  patchOrgValidationSchema,
} from "../validationSchemas";
import { Organization } from "../models";
import { tryCatch } from "../utils/tryCatch";
import authenticateToken from "../middlewares/authenticateToken";

const router = Router();

/**
 * @openapi
 * '/organizations':
 *  post:
 *    tags:
 *    - Organization
 *    summary: Add new Organization
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateOrganizationInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/organizations",
  ajvWrapper(postOrgValidationSchema),
  tryCatch(Organization.addRecord)
);

/**
 * @openapi
 * '/organizations':
 *  get:
 *    tags:
 *    - Organization
 *    summary: Get list of organizations
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationListResponse'
 *      404:
 *        description: Organization not found
 */
router.get("/organizations", tryCatch(Organization.getRecords));

/**
 * @openapi
 * '/organizations/{organizationId}':
 *  get:
 *    tags:
 *    - Organization
 *    summary: Get single organization by organizationId
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationResponse'
 *      404:
 *        description: Organization not found
 */
router.get("/organizations/:organizationId", tryCatch(Organization.getRecord));

/**
 * @openapi
 * '/organizations/{organizationId}':
 *  patch:
 *    tags:
 *    - Organization
 *    summary: Update single organization by organizationId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateOrganizationInput'
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationResponse'
 *      404:
 *        description: Organization not found
 */
router.patch(
  "/organizations/:organizationId",
  ajvWrapper(patchOrgValidationSchema),
  tryCatch(Organization.patchRecord)
);

/**
 * @openapi
 * '/organizations/{organizationId}':
 *  delete:
 *    tags:
 *    - Organization
 *    summary: Delete single organization by organizationId
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    responses:
 *      204:
 *        description: Success
 *      404:
 *        description: Organization not found
 */
router.delete(
  "/organizations/:organizationId",
  tryCatch(Organization.removeRecord)
);

/**
 * @openapi
 * '/organizations/{organizationId}/user/{userId}':
 *  post:
 *    tags:
 *    - Organization
 *    summary: Attach user to organization
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    - name: userId
 *      in: path
 *      description: The id of user
 *      required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrganizationUserInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationResponse'
 *      404:
 *        description: Organization not found
 */
router.post(
  "/organizations/:organizationId/user/:userId",
  tryCatch(Organization.handleAddUser)
);

/**
 * @openapi
 * '/organizations/{organizationId}/user/{userId}':
 *  patch:
 *    tags:
 *    - Organization
 *    summary: Change user in organization
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    - name: userId
 *      in: path
 *      description: The id of user
 *      required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrganizationUserInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationResponse'
 *      404:
 *        description: Organization not found
 */
router.patch(
  "/organizations/:organizationId/user/:userId",
  tryCatch(Organization.handleAddUser)
);

/**
 * @openapi
 * '/organizations/{organizationId}/user/{userId}':
 *  delete:
 *    tags:
 *    - Organization
 *    summary: Remove user from organization
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    - name: userId
 *      in: path
 *      description: The id of user
 *      required: true
 *    responses:
 *      204:
 *        description: Success
 *      404:
 *        description: Not found
 */
router.delete(
  "/organizations/:organizationId/user/:userId",
  tryCatch(Organization.handleRemoveUser)
);

/**
 * @openapi
 * '/organizations/{organizationId}/users':
 *  get:
 *    tags:
 *    - Organization
 *    summary: Get list of organization users
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrganizationListResponse'
 *      404:
 *        description: Organization not found
 */
router.get(
  "/organizations/:organizationId/users",
  tryCatch(Organization.getUsers)
);

/**
 * @openapi
 * '/organizations/{organizationId}/projects':
 *  get:
 *    tags:
 *    - Organization
 *    summary: Get list of organization projects
 *    parameters:
 *    - name: organizationId
 *      in: path
 *      description: The id of organization
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProjectListResponse'
 *      404:
 *        description: Organization not found
 */
router.get(
  "/organizations/:organizationId/projects",
  authenticateToken,
  tryCatch(Organization.getProjects)
);

export default router;
