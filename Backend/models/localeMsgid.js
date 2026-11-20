const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const localeMsgid = sequelize.define(
  "localeMsgid",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    msgid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "kmsv6_locale_msgid_unique",
    },
    msgname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_locale_msgids",
    timestamps: false,
  },
);

module.exports = localeMsgid;
