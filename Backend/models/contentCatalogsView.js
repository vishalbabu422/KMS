const { DataTypes } = require("sequelize");
const sequelize = require("./../utils/database");

const ContentCatalogView = sequelize.define(
    "ContentCatalogView",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true, // REQUIRED for Sequelize
        },

        parent_id: DataTypes.BIGINT,
        path: DataTypes.STRING,
        uid: DataTypes.STRING,

        created: DataTypes.DATE,
        created_by: DataTypes.BIGINT,
        emp_name_en: DataTypes.STRING,
        email: DataTypes.STRING,
        designation: DataTypes.STRING,
        photo: DataTypes.BLOB,

        modified: DataTypes.DATE,
        modified_by: DataTypes.BIGINT,
        modified_employee_name: DataTypes.STRING,
        modified_email: DataTypes.STRING,
        modified_designation: DataTypes.STRING,
        modified_photo: DataTypes.BLOB,

        workflow_state_id: DataTypes.INTEGER,
        state_name: DataTypes.STRING,
        state_color: DataTypes.STRING,

        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        attachment: DataTypes.STRING,
        url: DataTypes.STRING,
        template: DataTypes.STRING,
        document_size: DataTypes.INTEGER,

        content_type_id: DataTypes.BIGINT,
        content_code: DataTypes.STRING,
        content_type: DataTypes.STRING,

        priority: DataTypes.BOOLEAN,
        priority_last_date: DataTypes.DATE,
        priority_order: DataTypes.INTEGER,
        assessed: DataTypes.BOOLEAN,
    },
    {
        schema: "kms",
        tableName: "kmsv6_content_catalogs_view",
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = ContentCatalogView;
