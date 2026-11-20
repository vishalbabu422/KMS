const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ContentMetadataMapping = sequelize.define(
  "ContentMetadataMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    catalog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    catalog_uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata_id: {
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    schema: "kms",
    tableName: "kmsv6_content_metadata_mappings",
    timestamps: false,
  }
);


module.exports = ContentMetadataMapping;
