import { Router } from "express";
import ajvWrapper from "../middlewares/ajvValidation";
import {
  postOrgValidationSchema,
  patchOrgValidationSchema,
} from "../validationSchemas";
import { Organization } from "../models/organizations";
import { tryCatch } from "../utils/tryCatch";

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

export default router;
