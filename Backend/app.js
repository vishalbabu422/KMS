const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

const fs = require("fs");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

// 1. MIDDLEWARE

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  next();
});

app.use(compression());
app.use(helmet());

// 2. SWAGGER DOCUMENTATION

const customCss = fs.readFileSync(path.join(__dirname, "swagger.css"), "utf8");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss,
    swaggerOptions: { docExpansion: "none" },
  }),
);

// 3. DEFAULT ROUTE

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to KMS 9.0 API Server.",
  });
});

// 4. API ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

// 5. UNDEFINED ROUTES

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// 6. GLOBAL ERROR HANDLER

app.use(globalErrorHandler);

module.exports = app;
