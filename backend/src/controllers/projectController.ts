import { Organization, Project } from "../models";

import { Request, Response } from "express";

import AppError from "../utils/AppError";

export const projectAddRecord = async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  res.send(project);
};

export const projectGetRecords = async (req: Request, res: Response) => {
  const projects = await Project.findAll();
  res.send(projects);
};

export const projectGetRecord = async (req: Request, res: Response) => {
  const project = await Project.findOne({
    where: { projectId: req.params.projectId },
    include: [{ model: Organization, as: "organization" }],
  });
  res.send(project);
};

export const projectPatchRecord = async (req: Request, res: Response) => {
  const project = await Project.findByPk(req.params.projectId);
  if (!project) throw new AppError(req, "Bed request", 400);
  await project.update(req.body);
  res.send(project);
};

export const projectRemoveRecord = async (req: Request, res: Response) => {
  await Project.destroy({ where: { projectId: req.params.projectId } });
  res.status(204).send();
};
