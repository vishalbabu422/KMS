const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const ContentWorkflowMapping = require("./contentWorkflowMapping");

const contentTypeMaster = sequelize.define(
  "contentTypeMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    content_code: {
      type: DataTypes.STRING(100),
    },

    content_name: {
      type: DataTypes.STRING(255),
    },

    content_name_hi: {
      type: DataTypes.STRING(255),
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    content_description: {
      type: DataTypes.STRING(500),
    },


    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    content_type: {
      type: DataTypes.STRING(255),
    },

    icon: {
      type: DataTypes.STRING(255),
    },

    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_content_type_master",
    timestamps: false,
  }
);

contentTypeMaster.hasOne(ContentWorkflowMapping, {
  as: "workflowMapping",
  foreignKey: "content_id",
});

module.exports = contentTypeMaster;
