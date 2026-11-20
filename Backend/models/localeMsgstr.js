const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const localeLanguageMaster = require("./localeLanguageMaster");
const localeMsgid = require("./localeMsgid");

const localeMsgstr = sequelize.define(
  "localeMsgstr",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    msg_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    } /*,
    msg_msgid: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }*/,
    msgstr: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_locale_msgstrs",
    timestamps: false,
  },
);

localeMsgstr.belongsTo(localeLanguageMaster, {
  foreignKey: "language_id",
  targetKey: "id",
  as: "language",
});

localeMsgstr.belongsTo(localeMsgid, {
  foreignKey: "msg_id",
  targetKey: "id",
  as: "message",
});

module.exports = localeMsgstr;
