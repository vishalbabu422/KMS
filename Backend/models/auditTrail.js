const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("./user");

const auditTrail = sequelize.define(
  "auditTrail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    login_id: {
      type: DataTypes.STRING(100),
    },
    activity: {
      type: DataTypes.TEXT,
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    login_ip: {
      type: DataTypes.STRING(100),
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_audit_trail",
    timestamps: false,
  }
);

auditTrail.belongsTo(User, {
    foreignKey: 'login_id',
    targetKey: 'login_id',   // column in UserRoleMapping
});

module.exports = auditTrail;
