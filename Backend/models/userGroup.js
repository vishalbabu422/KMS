 const { DataTypes, NOW } = require("sequelize");
 const sequelize = require("../utils/database");
 
 const userGroup = sequelize.define(
   "userGroup",
   {
     group_id: {
       type: DataTypes.BIGINT,
       allowNull: false,
       primaryKey: true,
       autoIncrement: true,
     },
     employee_id_fk: {
       type: DataTypes.INTEGER,
     },
     group_name: {
       type: DataTypes.STRING(255),
     },
   },
    {
     schema: "kms",
     tableName: "kmsv6_user_groups",
     timestamps: false,
   }
 );
 module.exports = userGroup;
