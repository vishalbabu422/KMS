const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const workflowTransition = sequelize.define(
  "workflowTransition",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    workflow_id: {
      type: DataTypes.INTEGER,
    },
    transition_name: {
      type: DataTypes.STRING(255),
    },
    transition_description: {
      type: DataTypes.STRING(500),
    },
    destination_state_id: {
      type: DataTypes.INTEGER,
    },
    transition_display_name: {
      type: DataTypes.STRING(255),
    },
    script_before: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_workflow_transitions",
    timestamps: false,
  }
);
module.exports = workflowTransition;
