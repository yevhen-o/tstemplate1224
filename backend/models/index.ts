import db from "../db_connect";
import { DataTypes, Model } from "sequelize";

// Import individual models
import { defineOrganizationModel } from "./organizations";
import { defineUserModel } from "./users";
import { defineTodoModel } from "./todos";
import { defineProjectModel } from "./projects";
import { defineTokenModel } from "./tokens";

// Define models
const Organization = defineOrganizationModel(db);
const User = defineUserModel(db);
const Todo = defineTodoModel(db);
const Project = defineProjectModel(db);
const Token = defineTokenModel(db);

// Define the junction model
// const OrganizationUser = db.define("organization_user", {
//   role: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
// });

class OrganizationUser extends Model {
  public role?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrganizationUser.init(
  {
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "organization_user",
  }
);

// Define associations
Organization.belongsToMany(User, {
  through: OrganizationUser,
  foreignKey: "organizationId",
});
User.belongsToMany(Organization, {
  through: OrganizationUser,
  foreignKey: "userId",
});
User.hasMany(Organization, {
  foreignKey: "ownerId",
  as: "ownedOrganizations",
});
Organization.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});
Organization.hasMany(Project, {
  foreignKey: "organizationId",
  as: "organizationProjects",
});
Project.belongsTo(Organization, {
  foreignKey: "organizationId",
  as: "organization",
});
Project.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});
User.hasMany(Project, {
  foreignKey: "ownerId",
  as: "ownedProjects",
});

// Export models
export { Organization, User, Todo, Project, Token, OrganizationUser, db };
