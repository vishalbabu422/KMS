const { DataTypes } = require("sequelize");
const database = require("./../utils/database");
const RoleMaster = require("./roleMaster");

const UserRoleMapping = database.define(
  "UserRoleMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      required: [true, "Please provide employee_id!"],
    },
    role_id: {
      type: DataTypes.INTEGER,
      required: [true, "Please select Role"],
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_user_role_mappings",
    createdAt: false,
    updatedAt: false,
  }
);
UserRoleMapping.belongsTo(RoleMaster, {
  foreignKey: {
    name: "role_id",
  },
});
module.exports = UserRoleMapping;
