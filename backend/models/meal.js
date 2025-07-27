 const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["breakfast", "lunch", "dinner", "snack"], 
    required: true 
  },
  servings: { 
    type: Number,
    min: 1,
  },
  calories: { 
    type: Number 
  },
  recipeId: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Recipe" 
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Meal", mealSchema);