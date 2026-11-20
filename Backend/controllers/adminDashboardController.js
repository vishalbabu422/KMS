


const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");
const sequelize = require("../utils/database");
const { Op, fn, literal, col } = require("sequelize");

const ContentCatalogView = require("./../models/contentCatalogsView");

/******************** All Recently Created *******************/

const getRecentCreatedList = catchAsync(async (req, res) => {
  let { startDate, endDate } = req.query;
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};
  // 👉 Default: last 1 month
  if (!startDate && !endDate) {
    endDate = new Date();
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
  }
  // 👉 Filter by created BETWEEN
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full day
    features.query.where.created = {
      [Op.between]: [start, end],
    };
  }

  const { rows: recentlyCreatedList, count } =
    await ContentCatalogView.findAndCountAll(features.query);

  res.status(200).json({
    status: "success",
    message: "Get All Recently Created List!",
    total: count,
    results: recentlyCreatedList.length,
    data: { recentlyCreatedList },
  });
});

const dashboardCounts = catchAsync(async (req, res, next) => {
  let { filter, ...queryForFeatures } = req.query;
  const features = new APIFeatures(queryForFeatures)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};

  // today date
  let today = new Date();

  //date variable to pass in query
  let dateTime;

  //based on filter set date

  if (filter === "Today") {
    dateTime = new Date(today.setHours(0, 0, 0, 0));
  } else if (filter === "Monthly") {
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    daysInLastMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    ).getDate();

    if (today.getDate() > daysInLastMonth) lastMonth.setDate = daysInLastMonth;

    lastMonth.setHours(0, 0, 0, 0);

    dateTime = lastMonth;
  } else if (filter === "Yearly") {
    dateTime = new Date(today);
    dateTime.setFullYear(today.getFullYear() - 1);
    dateTime.setHours(0, 0, 0, 0);
  }

  features.query.where.created = {
    [Op.gt]: dateTime,
  };

  // type based conditions

  const typeConditions = {
    created: {
      content_type: { [Op.ne]: "Folderish" },
    },
    published: {
      content_type: { [Op.ne]: "Folderish" },
      state_name: "Published",
    },
    pending: {
      content_type: { [Op.ne]: "Folderish" },
      state_name: "Pending",
    },
    collections: {
      content_type: "Folderish",
    },
  };

  const results = [];

  for (const [type, conditions] of Object.entries(typeConditions)) {
    const where = {
      ...features.query.where,
      ...conditions,
    };

    const count = await ContentCatalogView.count({
      ...features.query,
      where,
    });

    results.push({
      label: type,
      count,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Get Dashboard counts",
    data: results,
  });
});

// get valid years of KMS Usage --  Output: array
const getValidYears = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query);

  if (!features.query.where) features.query.where = {};

  const earliestRecord = await ContentCatalogView.findOne({
    attributes: ["created"],
    order: [["created", "ASC"]],
  });

  const currentYear = new Date().getFullYear();

  const earliestYear = earliestRecord
    ? new Date(earliestRecord.created).getFullYear()
    : currentYear;

  const years = [];

  for (let year = earliestYear; year <= currentYear; year++) {
    years.push(year);
  }

  res.status(200).json({
    status: "success",
    message: "Get all valid years!",
    results: years.length,
    data: { years },
  });
});

const getYearlyReport = catchAsync(async (req, res, next) => {
  let { year, ...queryForFeatures } = req.query;
  const features = new APIFeatures(queryForFeatures)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  if (!features.query.where) features.query.where = {};

  const states = ["Published", "Pending", "Visible","Private"];

  const result = {};

  for (const state of states) {
    result[state] = Array(12).fill(0);
  }

  const rows = await ContentCatalogView.findAll({
    attributes: [
      [fn("EXTRACT", literal("MONTH FROM created")), "month"],
      [fn("COUNT", col("id")), "count"],
      "state_name",
    ],
    where: {
      state_name: { [Op.in]: states },
      created: {
        [Op.between]: [
          new Date(`${year}-01-01`),
          new Date(`${year}-12-31 23:59:59`),
        ],
      },
    },
    group: ["month", "state_name"],
    raw: true,
  });

  for (const row of rows) {
    const state = row.state_name;
    const monthIndex = Number(row.month) - 1;
    const count = Number(row.count);

    result[state][monthIndex] = count;
  }

  res.status(200).json({
    status: "success",
    message: "Get monthly count of the specified year!",
    data: { result },
  });
});

module.exports = {
  getRecentCreatedList,
  dashboardCounts,
  getYearlyReport,
  getValidYears,
};
