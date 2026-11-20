const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const languageMaster = sequelize.define(
    "languageMaster",

    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        language_code: {
            type: DataTypes.STRING(7),
            allowNull: false,

        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
        language_short_code: {
            type: DataTypes.STRING(3),
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        schema: "kms",
        tableName: "kmsv6_language_masters",
        timestamps: false,
    }

);
module.exports = languageMaster;
