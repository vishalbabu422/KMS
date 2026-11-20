const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./../utils/database");
const UserRoleMapping = require("./userRoleMapping");

const User = sequelize.define(
  "User",
  {
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_code: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    mobile: {
      type: DataTypes.INTEGER,
      defaultValue: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    appellation_name: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    login_id: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    designation: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    org_unit_name: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    employee_photo_path: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_empdetailsview",
    createdAt: false,
    updatedAt: false,
    hasPrimaryKeys: false,
  }
);

User.belongsTo(UserRoleMapping, {
  foreignKey: 'employee_id',  
  targetKey: 'employee_id',   // column in UserRoleMapping
});

module.exports = User;
