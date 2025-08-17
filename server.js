const express = require("express");
const {apiReference} = require("@scalar/express-api-reference")
const cors = require("cors");
require("dotenv").config();
require("./shared/db"); // Import the database connection
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/foodCategories", require("./routes/foodCategories"));
app.use("/api/mealPlans", require("./routes/mealPlans"));
app.use("/api/grocery-lists", require("./routes/groceryLists"));
app.use("/api/nutrition", require("./routes/nutrition"));
app.use("/api/bmi", require("./routes/bmi"));

// Basic health/info
app.get("/", (req, res) => {
  res.json({
    message: "Meal Planner API is running",
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Not Set",
    mongoUri: process.env.MONGODB_URI ? "Set" : "Not Set",
    env: process.env.NODE_ENV || "development",
  });
});

// Optional: serve API reference UI (expects you to serve /openapi.json)
app.use(
  "/reference",
  apiReference({
    url: "/openapi.json",
  })
);

// 404 handler (after all routes)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler (last)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // helpful for testing
