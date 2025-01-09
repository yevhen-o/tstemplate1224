import { Request, Response } from "express";
const Sequelize = require("sequelize");

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
  const Org = await Organization.findOne({
    where: { organizationId: req.params.organizationId },
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
