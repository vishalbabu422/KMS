const { DataTypes } = require("sequelize");
const sequelize = require("./../utils/database");

const ContentCatalogField = sequelize.define(
  "ContentCatalogField",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    content_catalog_id: {
      type: DataTypes.INTEGER,
    },
    u_id: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    attachment: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    template: {
      type: DataTypes.STRING,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_content_catalog_fields",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = ContentCatalogField;
