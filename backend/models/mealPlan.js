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
  meals: [{
    title: {
      type: String,
      required: true
    },
    mealLayoutIndex: {
      type: Number,
      required: true 
    },
    calories: {
      type: Number  
    },
    recipe: [{
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
      },
      quantity: {
        type: Number,
        min: 1,
      },
      unit: {
        type: String,
        required: true,
        default: "serving"
      },
      eaten: {
        type: Boolean,
        default: false
      }
    }]
  }],
}, { timestamps: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);