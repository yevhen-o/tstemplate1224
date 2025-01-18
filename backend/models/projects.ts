import { Request, Response } from "express";
import { Organization } from "./organizations";
const Sequelize = require("sequelize");

const db = require("../db_connect");

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProjectInput:
 *       type: object
 *       required:
 *         - name
 *         - organizationId
 *         - userId
 *       properties:
 *         organizationId:
 *           type: number
 *           default: 2
 *         ownerId:
 *           type: number
 *           default: 2
 *         name:
 *           type: string
 *           default: Project 1
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         ownerId:
 *           type: string
 *     ProjectListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           description:
 *             type: string
 *           imageUrl:
 *             type: string
 */

export const Project = db.define("project", {
  projectId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(10000),
    allowNull: true,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  organizationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Project.sync({ force: true });

export type ProjectInterface = {
  name: string;
  description?: string;
  imageUrl: string;
  organizationId: number;
};

Project.addRecord = async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  res.send(project);
};

Project.getRecords = async (req: Request, res: Response) => {
  const projects = await Project.findAll();
  res.send(projects);
};

Project.getRecord = async (req: Request, res: Response) => {
  const project = await Project.findOne({
    where: { projectId: req.params.projectId },
    include: [{ model: Organization, as: "organization" }],
  });
  res.send(project);
};

Project.patchRecord = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.projectId);
  await project.update(req.body);
  res.send(project);
};

Project.removeRecord = async (req: Request, res: Response) => {
  await Project.destroy({ where: { projectId: req.params.projectId } });
  res.status(204).send();
};
