const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const organisationMaster = sequelize.define(
    "organisationMaster",

    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        organisation_code: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(255),
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
        parent_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        schema: "kms",
        tableName: "kmsv6_organisation_masters",
        timestamps: false,
    }

);

organisationMaster.hasOne(organisationMaster, {
    as: "Parent",
    foreignKey: "id",
    sourceKey: "parent_id",
});

organisationMaster.hasMany(organisationMaster, {
    as: "Children",
    foreignKey: "parent_id",
});

module.exports = organisationMaster;











