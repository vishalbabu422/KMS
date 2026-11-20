const catchAsync = require("../utils/catchAsync");
const Storage = require("./../models/storage");
const EmpDetailsView = require("./../models/user");

// CHECK EMPLOYEE EXISTS
const checkEmployeeExists = async (employee_id) => {
  const employee = await EmpDetailsView.findOne({
    where: {
      employee_id,
    },
  });

  return employee;
};

// CREATE STORAGE
exports.createStorage = catchAsync(async (req, res, next) => {
  const { Storage: storageData } = req.body;

  if (
    !storageData ||
    typeof storageData !== "object" ||
    Array.isArray(storageData)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid input. Storage object is required.",
    });
  }

  const { employee_id, assigned_storage, is_active } = storageData;

  // Validate employee_id and assigned_storage
  if (
    employee_id === undefined ||
    assigned_storage === undefined ||
    !Number.isInteger(Number(employee_id)) ||
    Number(employee_id) <= 0 ||
    !Number.isInteger(Number(assigned_storage)) ||
    Number(assigned_storage) < 0
  ) {
    return res.status(400).json({
      status: "error",
      message: "Valid employee_id and assigned_storage are required.",
    });
  }

  // Validate is_active
  if (is_active !== undefined && typeof is_active !== "boolean") {
    return res.status(400).json({
      status: "error",
      message: "is_active must be a boolean value.",
    });
  }

  // Check employee exists in kmsv6_empdetailsview
  const employee = await checkEmployeeExists(employee_id);

  if (!employee) {
    return res.status(400).json({
      status: "error",
      message: "Employee does not exist.",
    });
  }

  // Create Storage
  const createdStorage = await Storage.create({
    employee_id,
    assigned_storage,
    is_active: is_active ?? true,
    is_deleted: false,
  });

  res.status(201).json({
    status: "success",
    message: "KMS Storage Created!",
    data: {
      id: createdStorage.id,
    },
  });
});


// GET STORAGE BY ID
exports.getStorageById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid Storage ID.",
    });
  }

  const storage = await Storage.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!storage) {
    return res.status(404).json({
      status: "error",
      message: "KMS Storage not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "KMS Storage retrieved successfully.",
    data: storage,
  });
});


// UPDATE STORAGE
exports.updateStorage = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid Storage ID.",
    });
  }

  const { employee_id, assigned_storage, is_active } = req.body;

  const updateData = {};

  // Validate and check employee_id
  if (employee_id !== undefined) {
    if (
      !Number.isInteger(Number(employee_id)) ||
      Number(employee_id) <= 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid employee_id.",
      });
    }

    // Check employee exists in kmsv6_empdetailsview
    const employee = await checkEmployeeExists(employee_id);

    if (!employee) {
      return res.status(400).json({
        status: "error",
        message: "Employee does not exist.",
      });
    }

    updateData.employee_id = employee_id;
  }

  // Validate assigned_storage
  if (assigned_storage !== undefined) {
    if (
      !Number.isInteger(Number(assigned_storage)) ||
      Number(assigned_storage) < 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid assigned_storage.",
      });
    }

    updateData.assigned_storage = assigned_storage;
  }

  // Validate is_active
  if (is_active !== undefined) {
    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "is_active must be a boolean value.",
      });
    }

    updateData.is_active = is_active;
  }

  // Check if any field is provided
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Please provide at least one field to update.",
    });
  }

  // Update Storage
  const [updatedCount] = await Storage.update(updateData, {
    where: {
      id,
      is_deleted: false,
    },
  });

  if (updatedCount === 0) {
    return res.status(404).json({
      status: "error",
      message: "KMS Storage not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "KMS Storage Updated!",
    data: {
      id,
    },
  });
});