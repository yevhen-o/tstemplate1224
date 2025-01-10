import { Request, Response } from "express";
const Sequelize = require("sequelize");
import { User } from "./";

const db = require("../db_connect");

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateOrganizationInput:
 *       type: object
 *       required:
 *         - name
 *         - domain
 *         - ownerId
 *       properties:
 *         name:
 *           type: string
 *           default: Org__
 *         domain:
 *           type: string
 *           default: org_
 *         ownerId:
 *           type: number
 *           default: 1
 *     OrganizationResponse:
 *       type: object
 *       properties:
 *         organizationId:
 *           type: number
 *         name:
 *           type: string
 *         domain:
 *           type: string
 *         ownerId:
 *           type: number
 *         owner:
 *           type: object
 *           $ref: '#/components/schemas/UserResponse'
 *     OrganizationListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           organizationId:
 *             type: number
 *           name:
 *             type: string
 *           domain:
 *             type: string
 *           ownerId:
 *             type: string
 *     OrganizationUserInput:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           default: Admin
 */

export const Organization = db.define("organization", {
  organizationId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  domain: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Organization.sync({ force: true });

export type OrganizationInterface = {
  organizationId: number;
  name: string;
  domain: string;
  ownerId: number;
};

Organization.addRecord = async (req: Request, res: Response) => {
  const Org = await Organization.create(req.body);
  res.send(Org);
};

Organization.getRecords = async (req: Request, res: Response) => {
  const Orgs = await Organization.findAll({
    attributes: ["organizationId", "name", "domain", "ownerId"],
  });
  res.send(Orgs);
};

Organization.getRecord = async (req: Request, res: Response) => {
  const Org = await Organization.findByPk(req.params.organizationId, {
    include: [{ model: User, as: "owner" }],
  });
  res.send(Org);
};

Organization.patchRecord = async (req: Request, res: Response) => {
  const Org = await Organization.findOne({
    where: { organizationId: req.params.organizationId },
  });
  await Org.update(req.body);
  res.send(Org);
};

Organization.removeRecord = async (req: Request, res: Response) => {
  await Organization.destroy({
    where: { organizationId: req.params.organizationId },
  });
  res.status(204).send();
};

Organization.handleAddUser = async (req: Request, res: Response) => {
  const { role } = req.body;
  const { organizationId, userId } = req.params;
  const organization = await Organization.findByPk(organizationId);
  const user = await User.findByPk(userId);
  const result = await organization.addUser(user, { through: { role } });
  res.send(result);
};

Organization.handleRemoveUser = async (req: Request, res: Response) => {
  const { userId, organizationId } = req.params;
  const organization = await Organization.findByPk(organizationId);
  const user = await User.findByPk(userId);
  await organization.removeUser(user);
  res.status(204).send();
};

Organization.getUsers = async (req: Request, res: Response) => {
  const Org = await Organization.findByPk(req.params.organizationId, {
    include: [{ model: User }],
  });
  res.send(Org.users);
};
