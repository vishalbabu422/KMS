   const { DataTypes, NOW } = require("sequelize");
   const sequelize = require("../utils/database");
   
   const workflowStatePermission = sequelize.define(
     "workflowStatePermission",
     
       {
       id: {
         type: DataTypes.BIGINT,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true,
       },
       state_id: {
         type: DataTypes.INTEGER,
       },
       action_id: {
         type: DataTypes.INTEGER,
       },
       role_id: {
         type: DataTypes.INTEGER,
       },
     },
     {
       schema: "kms",
       tableName: "kmsv6_workflow_state_permissions",
       timestamps: false,
     }
      
   );
    module.exports = workflowStatePermission;
