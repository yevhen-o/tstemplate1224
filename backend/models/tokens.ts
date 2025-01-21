import { Sequelize, DataTypes, Model } from "sequelize";

export const defineTokenModel = (sequelize: Sequelize) => {
  class Token extends Model {
    public token!: string;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Token.init(
    {
      token: {
        primaryKey: true,
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "token",
    }
  );

  return Token;
};

//Token.sync({ force: true });
