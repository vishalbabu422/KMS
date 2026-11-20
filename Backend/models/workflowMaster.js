
const { DataTypes, NOW } = require("sequelize");
const sequelize = require("./../utils/database");

const WorkflowStates = require("./workflowState");
const WorkflowTransitions = require("./workflowTransition");

const workflowMaster = sequelize.define(
  "workflowMaster",

  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    workflow_name: {
      type: DataTypes.STRING(255),
    },
    workflow_description: {
      type: DataTypes.STRING(500),
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
     is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_workflow_master",
    timestamps: false,
  }

);

workflowMaster.hasMany(WorkflowStates, {
  foreignKey: "workflow_id",
  as: "workflowStates",
  scope: { is_deleted: 0 },
});

workflowMaster.hasMany(WorkflowTransitions, {
  foreignKey: "workflow_id",
  as: "workflowTransitions",
  scope: { is_deleted: 0 },
});

WorkflowStates.belongsTo(workflowMaster, {
  foreignKey: "workflow_id",
  as: "workflow",
});

WorkflowTransitions.belongsTo(workflowMaster, {
  foreignKey: "workflow_id",
  as: "workflow",
});

module.exports = workflowMaster;

