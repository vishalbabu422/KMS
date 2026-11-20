require("dotenv").config({ path: "./config.env" });

const app = require("./app");
const sequelize = require("./utils/database");

const port = process.env.PORT || 3500;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL connected successfully.");

    const server = app.listen(port, () => {
      console.log(`KMS API running on port ${port}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION:", err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
