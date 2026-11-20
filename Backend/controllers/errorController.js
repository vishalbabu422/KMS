const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
  console.error("KMS API ERROR:", err);

  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Trusted operational errors
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message,
    });
  }

  // Unexpected programming or database errors
  console.error("KMS API ERROR:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // PostgreSQL unique constraint violation
  if (err.code === "23505") {
    error = new AppError("Duplicate record. This value already exists.", 409);
  }

  // PostgreSQL foreign key violation
  else if (err.code === "23503") {
    error = new AppError("Related record not found or cannot be deleted.", 400);
  }

  // Sequelize validation errors
  else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const message = err.errors
      ? err.errors.map((item) => item.message).join(". ")
      : "Invalid input data.";

    error = new AppError(message, 400);
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(error, req, res);
  }

  return sendErrorProd(error, req, res);
};
