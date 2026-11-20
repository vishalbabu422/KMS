  const { DataTypes, NOW } = require("sequelize");
 const sequelize = require("../utils/database");
 
 const mimeTypeMaster = sequelize.define(
     "mimeTypeMaster",
 
     {
         id: {
             type: DataTypes.BIGINT,
             allowNull: false,
             primaryKey: true,
             autoIncrement: true,
         },
         extension: {
             type: DataTypes.CHAR(255),
             allowNull: false,
         },
         mimetype: {
            type: DataTypes.CHAR(255),
         },
         status: {
             type: DataTypes.BOOLEAN,
             allowNull: false,
             defaultValue: true
         },
         is_deleted: {
             type: DataTypes.BOOLEAN,
             defaultValue: false,
             allowNull: false,
         },
     },
     {
         schema: "kms",
         tableName: "kmsv6_mimetype_masters",
         timestamps: false,
     }
 
 );
 module.exports = mimeTypeMaster;
