const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const localeLanguageMaster = sequelize.define(
  "localeLanguageMaster",

  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    lang_shortcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    lang_name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_locale_language_masters",
    timestamps: false,
  },
);
module.exports = localeLanguageMaster;
