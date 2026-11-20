const sequelize = require("../utils/database");
const ContentCatalogView = require("../models/contentCatalogsView");

exports.getAll = async (queryOptions) => {
  return ContentCatalogView.findAndCountAll({
    ...queryOptions,
  });
};
