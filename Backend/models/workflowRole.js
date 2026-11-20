
const { DataTypes, NOW } = require("sequelize");
const sequelize = require("./../utils/database");

const workflowRole = sequelize.define(
  "workflowRole",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "role_name is required"
        }
      }
    },
    is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: false, // <— required
      validate: {
        notEmpty: {
          msg: "display_name is required"
        }
      }
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_workflow_roles",
    timestamps: false,
  }

);

module.exports = workflowRole;

