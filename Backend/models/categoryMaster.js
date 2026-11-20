const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const categoryMaster = sequelize.define(
    "categoryMaster",

    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        category_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        schema: "kms",
        tableName: "kmsv6_category_masters",
        timestamps: false,
    }
);

categoryMaster.hasOne(categoryMaster, {
    as: "Parent",
    foreignKey: "id",
    sourceKey: "parent_id",
});

categoryMaster.hasMany(categoryMaster, {
    as: "Children",
    foreignKey: "parent_id",
});

module.exports = categoryMaster;
