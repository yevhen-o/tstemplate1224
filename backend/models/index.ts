const db = require("../db_connect");
const Sequelize = require("sequelize");

import { Organization } from "./organizations";
import { User } from "./users";
import { Todo } from "./todos";

const OrganizationUser = db.define("organization_user", {
  role: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

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

// Sync models with the database
// (async () => {
//   await db.sync({ alter: true }); // Adjust options as necessary
// })();

export { Todo, Organization, User, OrganizationUser };
