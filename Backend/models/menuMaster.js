const { DataTypes } = require("sequelize");
const database = require("../utils/database");

const MenuMaster = database.define(
  "MenuMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: false,
    },
    module_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: false,
    },
    module_name_hi: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: false,
    },
    controller: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: false,
    },
    plugin: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      primaryKey: false,
    },
  },
  {
    schema: "kms",
    tableName: "kmsv6_menu_items",
    createdAt: false,
    updatedAt: false,
  }
);

MenuMaster.hasMany(MenuMaster, {
  as: "children",
  foreignKey: "parent_id",
});

module.exports = MenuMaster;
