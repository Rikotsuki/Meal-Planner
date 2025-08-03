const express = require("express");
const { get } = require("mongoose");
const { getFoodCategoryByType } = require("../services/foodCategories");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", getFoodCategoryByType);

module.exports = router;
