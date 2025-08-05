const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },
  date :{
    type: Date,
    required: true,
  },
  totalCalories: {
      type: Number  
  },
  meals:  [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Meal", 
    required: true 
  }],
  nutrition: {
      totals: {
        calories: Number,
        carbs: Number,
        fat: Number,
        protein: Number,
        fiber: Number,
        sodium: Number,
        cholesterol: Number
      },
      targets: {
        calories: Number,
        carbs: {
          min: Number,
          max: Number
        },
        fat: {
          min:Number,
          max: Number
        },
        protein: {
          min: Number,
          max: Number
        },
        fiber: Number
      },
      macrosPercent: {
        fat: Number,
        carbs: Number,
        protein: Number
      }
    }
  
}, { timestamps: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);