const { DataTypes } = require("sequelize");
const database = require("../utils/database");

const RoleMaster = database.define(
  "RoleMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      required: [true, "Please provide Role Name!"],
    },
    is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_global_roles",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = RoleMaster;
