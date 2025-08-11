const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  preferences: {
    diet: String,
    calories: String,
    meals: String,
    carbs: String,
    fat: String,
    protein: String
  },
  mealNames: [String], // Store only meal names to save storage space
  dailyPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "DailyNutrition"
  }]
}, { timestamps: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);