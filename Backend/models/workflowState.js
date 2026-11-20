
const { DataTypes, NOW } = require("sequelize");
const sequelize = require("./../utils/database");

const workflowState = sequelize.define(
  "workflowState",

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
    state_name: {
      type: DataTypes.STRING(255),
    },
    state_description: {
      type: DataTypes.STRING(500),
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
   is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },

    state_color: {
      type: DataTypes.STRING(255),
      defaultValue: '#FFFFFF',
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_workflow_states",
    timestamps: false,
  }

);
module.exports = workflowState;


