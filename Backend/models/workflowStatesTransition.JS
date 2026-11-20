 const { DataTypes, NOW } = require("sequelize");
  const sequelize = require("../utils/database");
  
  const workflowStateTransition = sequelize.define(
    "workflowStateTransition",
    
      {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      workstate_id: {
        type: DataTypes.INTEGER,
      },
      transition_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      schema: "kms",
      tableName: "kmsv6_workflow_states_transitions",
      timestamps: false,
    }
     
  );
  module.exports = workflowStateTransition;
