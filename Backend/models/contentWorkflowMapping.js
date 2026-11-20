const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const contentWorkflowMapping = sequelize.define(
  "contentWorkflowMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    workflow_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_content_workflow_mappings",
    timestamps: false,
  },
);

module.exports = contentWorkflowMapping;
