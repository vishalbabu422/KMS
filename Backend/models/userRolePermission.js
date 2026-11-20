const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const userRolePermission = sequelize.define(
  "userRolePermission",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    module_id: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_user_role_permissions",
    timestamps: false,
  }
);
module.exports = userRolePermission;
