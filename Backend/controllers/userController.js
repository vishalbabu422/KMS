const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeature");
const User = require("./../models/user");
const UserRoleMapping = require("./../models/userRoleMapping");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  features.query.order = [["full_name", "ASC"]];

  features.query.include = [
    {
      model: UserRoleMapping
    },
  ];

  // console.log(features);return false;
  const users = await User.findAll(features.query);
  res.status(200).json({
    status: "success",
    message: "Get Users!",
    results: users.length,
    data: { users },
  });
});

exports.getUserRoles = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const userRoles = await UserRoleMapping.findAll(features.query);
  res.status(200).json({
    status: "success",
    message: "Get userRoleMapping!",
    results: userRoles.length,
    data: { userRoles },
  });
});

exports.updateUserRole = async (req, res) => {
  try {
    const { employee_id } = req.body.userRole;
    const { role_id } = req.body.userRole;

    if (!role_id) {
      return res.status(400).json({ message: "role_id is required" });
    }

    // 🔍 Check if mapping exists
    let mapping = await UserRoleMapping.findOne({
      where: { employee_id },
    });

    if (mapping) {
      // ✅ Update existing mapping
      mapping.role_id = role_id;
      await mapping.save();

      return res.json({
        message: "User role updated successfully",
        data: mapping,
      });
    } else {
      // ✅ Create new mapping if not found
      mapping = await UserRoleMapping.create({
        employee_id,
        role_id,
      });

      return res.status(201).json({
        message: "User role created successfully",
        data: mapping,
      });
    }
  } catch (err) {
    console.error("❌ updateUserRole error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchUserRoles = catchAsync(async (req, res, next) => {});
