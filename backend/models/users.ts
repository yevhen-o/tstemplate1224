import { Sequelize, DataTypes, Model } from "sequelize";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         firstName:
 *           type: string
 *           default: James
 *         lastName:
 *           type: string
 *           default: Bond
 *         email:
 *           type: string
 *           default: james_bond@google.com
 *         password:
 *           type: string
 *           default: strongPassword123
 *         confirmPassword:
 *           type: string
 *           default: strongPassword123
 *         age:
 *           type: number
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: james_bond@google.com
 *         password:
 *           type: string
 *           default: strongPassword123
 *     UserResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *         accessToken:
 *           type: string
 *     UserListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           userId:
 *             type: number
 *           firstName:
 *             type: string
 *           age:
 *             type: number
 */

type Organization = {
  organizationId: number;
  name: string;
  domain: string;
  ownerId: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export const defineUserModel = (sequelize: Sequelize) => {
  class User extends Model {
    public userId!: number;
    public firstName!: string;
    public lastName?: string;
    public email!: string;
    public password!: string;
    public age?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public organizations?: Organization[];
    public ownedOrganizations?: Organization[];
  }

  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "todo",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    }
  );

  return User;
};

// User.sync({ force: true });
