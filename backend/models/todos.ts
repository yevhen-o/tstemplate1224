import { Sequelize, DataTypes, Model } from "sequelize";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTodoInput:
 *       type: object
 *       required:
 *         - uid
 *         - title
 *       properties:
 *         uid:
 *           type: string
 *           default: someUniqString
 *         title:
 *           type: string
 *           default: Some nice todo to have done
 *         deadline:
 *           type: string
 *           default: Sun Dec 28 2025 00:00:00 GMT+0100 (Central European Standard Time)
 *         isCompleted:
 *           type: boolean
 *           default: false
 *         priority:
 *           type: string
 *           default: low
 *         isImportant:
 *           type: boolean
 *           default: true
 *         scope:
 *           type: string
 *           default: forFun
 *     TodoResponse:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *         title:
 *           type: string
 *         deadline:
 *           type: string
 *         isCompleted:
 *           type: boolean
 *         priority:
 *           type: string
 *         isImportant:
 *           type: boolean
 *         scope:
 *           type: string
 *         createdAt:
 *           type: boolean
 *         updatedAt:
 *           type: string
 *     TodoListResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           uid:
 *             type: string
 *           title:
 *             type: string
 *           deadline:
 *             type: string
 *           priority:
 *             type: string
 *           isImportant:
 *             type: boolean
 *           scope:
 *             type: string
 */

export const defineTodoModel = (sequelize: Sequelize) => {
  class Todo extends Model {
    public uid!: string;
    public title!: string;
    public deadline?: string;
    public isCompleted?: boolean;
    public priority?: string;
    public isImportant?: boolean;
    public scope?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Todo.init(
    {
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(10000),
        allowNull: false,
      },
      deadline: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      priority: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      isImportant: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      scope: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "todo",
    }
  );

  return Todo;
};

//Todo.sync({ force: true });
