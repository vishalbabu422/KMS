const {DataTypes} = require("sequelize");
const sequelize  = require("../utils/database");

const storage = sequelize.define(
    "storage",
    {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    assigned_storage: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_storage",
    timestamps: false,
  }
);
module.exports = storage;    
