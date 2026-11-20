const { DataTypes, NOW } = require("sequelize");
const sequelize = require("./../utils/database");

const workflowAction = sequelize.define(
  "workflowAction",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    action_name: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
     is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_workflow_actions",
    timestamps: false,
  }
);
module.exports = workflowAction;
