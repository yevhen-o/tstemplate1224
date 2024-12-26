const Sequelize = require("sequelize");
const keys = require("./keys");

const sequelize = new Sequelize(keys.pgDatabase, keys.pgUser, keys.pgPassword, {
  host: keys.pgHost,
  port: keys.pgPort,
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.DB_SSL == "true",
  },
});

module.exports = sequelize;
