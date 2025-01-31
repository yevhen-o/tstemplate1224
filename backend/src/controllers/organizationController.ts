import { Organization, User, Project } from "../models";

import { Request, Response } from "express";

import AppError from "../utils/AppError";

export const organizationAddRecord = async (req: Request, res: Response) => {
  const Org = await Organization.create({
    ...req.body,
    ownerId: req.user!.userId,
  });
  const user = await User.findByPk(req.user!.userId);
  //@ts-expect-error Something with associations
  await Org.addUser(user, { through: { role: "admin" } });
  res.send(Org);
};

export const organizationGetRecords = async (req: Request, res: Response) => {
  const Orgs = await Organization.findAll({
    attributes: ["organizationId", "name", "domain", "ownerId"],
  });
  res.send(Orgs);
};

export const organizationGetRecord = async (req: Request, res: Response) => {
  const Org = await Organization.findByPk(req.params.organizationId, {
    include: [{ model: User, as: "owner" }],
  });
  res.send(Org);
};

export const organizationPatchRecord = async (req: Request, res: Response) => {
  const Org = await Organization.findOne({
    where: { organizationId: req.params.organizationId },
  });
  if (!Org) throw new AppError(req, "Bed request", 400);
  await Org.update(req.body);
  res.send(Org);
};

export const organizationRemoveRecord = async (req: Request, res: Response) => {
  await Organization.destroy({
    where: { organizationId: req.params.organizationId },
  });
  res.status(204).send();
};

export const organizationHandleAddUser = async (
  req: Request,
  res: Response
) => {
  const { role } = req.body;
  const { organizationId, userId } = req.params;
  const organization = await Organization.findByPk(organizationId);
  const user = await User.findByPk(userId);
  if (!organization || !user) throw new AppError(req, "Bed request", 400);
  //@ts-expect-error Something with associations
  const result = await organization.addUser(user, { through: { role } });
  res.send(result);
};

export const organizationHandleRemoveUser = async (
  req: Request,
  res: Response
) => {
  const { userId, organizationId } = req.params;
  const organization = await Organization.findByPk(organizationId);
  const user = await User.findByPk(userId);
  if (!organization || !user) throw new AppError(req, "Bed request", 400);
  //@ts-expect-error Something with associations
  await organization.removeUser(user);
  res.status(204).send();
};

export const organizationGetUsers = async (req: Request, res: Response) => {
  const Org = await Organization.findByPk(req.params.organizationId, {
    include: [{ model: User }],
  });
  if (!Org) throw new AppError(req, "Bed request", 400);
  //@ts-expect-error Something with associations
  res.send(Org.users);
};

export const organizationGetProjects = async (req: Request, res: Response) => {
  const Org = await Organization.findByPk(req.params.organizationId, {
    include: [{ model: Project, as: "organizationProjects" }],
  });
  if (!Org) throw new AppError(req, "Bed request", 400);
  //@ts-expect-error Something with associations
  res.send(Org.organizationProjects);
};

export const organizationIsDomainAvailable = async (
  req: Request,
  res: Response
) => {
  const Org = await Organization.findOne({
    where: { domain: req.params.domain },
  });
  if (!Org) {
    return res
      .status(200)
      .json({ available: true, message: "Domain is available." });
  } else {
    res
      .status(200)
      .json({ available: false, message: "Domain is already in use." });
  }
};
