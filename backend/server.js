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

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/foodCategories", require("./routes/foodCategories"));
app.use("/api/mealPlans", require("./routes/mealPlans"));
app.use("/api/grocery-lists", require("./routes/groceryLists"));
app.use("/api/nutrition", require("./routes/nutrition"));
// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Meal Planner API is running",
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Not Set",
    mongoUri: process.env.MONGODB_URI ? "Set" : "Not Set"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.use(
  "/reference",
  apiReference({
    // Put your OpenAPI url here:
    url: "/openapi.json",
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
