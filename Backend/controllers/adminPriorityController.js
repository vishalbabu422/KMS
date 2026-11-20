const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");
const contentCatalogService = require("../services/contentCatalogService");


const getAllPriorityList = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .join()
    .paginate();

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  if (!features.query.where) features.query.where = {};

  const result = await contentCatalogService.getAll(features.query);

  res.status(200).json({
    status: "success",
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
    results: result.rows.length,
    data: result.rows,
  });
});

module.exports = {
  getAllPriorityList
};
