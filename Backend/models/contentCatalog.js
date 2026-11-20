const { DataTypes, NOW } = require("sequelize");
const sequelize = require("./../utils/database");
const ContentCatalogField = require("./contentCatalogField");
const ContentMetadataMapping = require('./contentMetadataMapping');
const User = require("./user");
const ContentTypeMaster = require('./contentTypeMaster');

const ContentCatalog = sequelize.define(
  "ContentCatalog",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content_type_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    uid: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    workflow_state_id: {
      type: DataTypes.INTEGER,
    },
    priority: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority_last_date: {
      type: DataTypes.DATE,
    },
    priority_order: {
      type: DataTypes.INTEGER,
    },
    assessed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    max_upload_size: {
      type: DataTypes.INTEGER,
    },
    remarks: {
      type: DataTypes.STRING,
    }
  },
  {
    schema: "kms",
    tableName: "kmsv6_content_catalogs",
    timestamps: false,
  }
);
ContentCatalog.hasOne(ContentCatalogField, {
  foreignKey: {
    name: "content_catalog_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

ContentCatalog.hasMany(ContentMetadataMapping, {
  foreignKey: {
    name: "catalog_id",
    as: "ContentMetadataMappings",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

ContentCatalogField.belongsTo(ContentCatalog, {
  foreignKey: {
    name: "content_catalog_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
ContentMetadataMapping.belongsTo(ContentCatalog, {
  foreignKey: {
    name: "catalog_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

// Created By
ContentCatalog.belongsTo(User, {
  foreignKey: "created_by",
  targetKey: "employee_id",
  as: "createdBy",
});

// Modified By
ContentCatalog.belongsTo(User, {
  foreignKey: "modified_by",
  targetKey: "employee_id",
  as: "modifiedBy",
});
ContentCatalog.belongsTo(ContentTypeMaster, {
  foreignKey: "content_type_id",
  targetKey: "id",
  as: "contentType",
});
module.exports = ContentCatalog;
