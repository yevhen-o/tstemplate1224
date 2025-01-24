import { Sequelize, DataTypes, Model } from "sequelize";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateOrganizationInput:
 *       type: object
 *       required:
 *         - name
 *         - domain
 *       properties:
 *         name:
 *           type: string
 *           default: Org__
 *         domain:
 *           type: string
 *           default: org_
 *     OrganizationResponse:
 *       type: object
 *       properties:
 *         organizationId:
 *           type: number
 *         name:
 *           type: string
 *         domain:
 *           type: string
 *         ownerId:
 *           type: number
 *         owner:
 *           type: object
 *           $ref: '#/components/schemas/UserResponse'
 *     OrganizationCheckDomainResponse:
 *       type: object
 *       properties:
 *         available:
 *           type: boolean
 *         message:
 *           type: string
 *     OrganizationListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           organizationId:
 *             type: number
 *           name:
 *             type: string
 *           domain:
 *             type: string
 *           ownerId:
 *             type: string
 *     OrganizationUserInput:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           default: Admin
 */

export const defineOrganizationModel = (sequelize: Sequelize) => {
  class Organization extends Model {
    public organizationId!: number;
    public name!: string;
    public domain!: string;
    public ownerId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  Organization.init(
    {
      organizationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      domain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "organization",
    }
  );
  return Organization;
};
