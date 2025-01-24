import { Sequelize } from "sequelize";
import keys from "./keys";

const sequelize = new Sequelize(keys.pgDatabase, keys.pgUser, keys.pgPassword, {
  host: keys.pgHost,
  port: +keys.pgPort,
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.DB_SSL === "true", // Ensure strict equality
  },
});

export default sequelize;
