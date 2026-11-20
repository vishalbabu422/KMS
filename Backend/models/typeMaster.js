const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const typeMaster = sequelize.define(
    "typeMaster",

    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        type_code: {
            type: DataTypes.STRING(6),
            allowNull: false,

        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(100),
        }

    },
    {
        schema: "kms",
        tableName: "kmsv6_type_masters",
        timestamps: false,
    }

);
module.exports = typeMaster;
