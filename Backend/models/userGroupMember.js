 const { DataTypes, NOW } = require("sequelize");
 const sequelize = require("./../utils/database");
 
 const userGroupMember = sequelize.define(
   "userGroupMember",
   {
     group_member_id: {
       type: DataTypes.BIGINT,
       allowNull: false,
       primaryKey: true,
       autoIncrement: true,
     },
     group_id_fk: {
       type: DataTypes.INTEGER,
     },
     group_employee_id: {
       type: DataTypes.INTEGER,
     },
   },
    {
     schema: "kms",
     tableName: "kmsv6_user_group_members",
     timestamps: false,
   }
 );
 module.exports = userGroupMember;
