 const express = require("express");
const auth = require("../middleware/auth");

const { generateMealPlan } = require("../services/mealPlan");

const router = express.Router();

router.get("/", auth,generateMealPlan);

module.exports = router;