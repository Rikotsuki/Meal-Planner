 const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal"
  }],
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  days: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);