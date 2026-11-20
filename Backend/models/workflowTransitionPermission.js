const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const workflowTransitionPermission = sequelize.define(
  "workflowTransitionPermission",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    transition_id: {
      type: DataTypes.INTEGER,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_workflow_transition_permissions",
    timestamps: false,
  }
);

module.exports = workflowTransitionPermission;
