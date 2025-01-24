import { Sequelize, DataTypes, Model } from "sequelize";

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

export const defineProjectModel = (sequelize: Sequelize) => {
  class Project extends Model {
    public projectId!: number;
    public name!: string;
    public description?: string;
    public imageUrl?: boolean;
    public organizationId!: number;
    public ownerId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Project.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(10000),
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "project",
    }
  );

  return Project;
};

// Project.sync({ force: true });
