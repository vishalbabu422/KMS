const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const contentTypeMaster = require("./contentTypeMaster");

const contentMetadata = sequelize.define(
  "contentMetadata",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    content_type_id: {
      type: DataTypes.INTEGER, 
      
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    is_mandatory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    max_length: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,   
      allowNull: true,
      defaultValue: false,
    },

    created: {
      type: DataTypes.DATEONLY,  
      
      allowNull: true,
    },

    type_data: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    custom_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    title_hi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    description_hi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_content_metadata",
    timestamps: false,
  }
);

contentMetadata.belongsTo(contentTypeMaster, {
  foreignKey: "content_type_id",
  as: "contentType",
});

module.exports = contentMetadata;
