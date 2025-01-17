const Sequelize = require("sequelize");

const db = require("../db_connect");

export const Token = db.define("token", {
  token: {
    primaryKey: true,
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

//Token.sync({ force: true });

Token.addRecord = async (token: string, userId: number) => {
  await Token.create({ token, userId });
};

Token.revokeByUser = async (userId: number) => {
  await Token.destroy({ where: { userId: userId } });
};

Token.removeRecord = async (token: string) => {
  await Token.destroy({ where: { token: token } });
};

Token.hasToken = async (token: string) => {
  const tokenRecord = await Token.findOne({ where: { token: token } });
  return !!tokenRecord;
};
