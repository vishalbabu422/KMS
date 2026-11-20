const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const userContact = sequelize.define(
  "userContact",
  {
    contact_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id_fk: {
      type: DataTypes.INTEGER,
    },
    contact_employee_id: {
      type: DataTypes.INTEGER,
    },
    contact_employee_name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_user_contact",
    timestamps: false,
  }
);
module.exports = userContact;
