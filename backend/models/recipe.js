 const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  ingredients: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "RecipeIngredient" 
  }], 
  instructions: [{ 
    type: String 
  }],
  prepTime: { 
    type: Number 
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },
  nutrition: {
    calories: Number,
    carbs: Number,
    fat: Number,
    protein: Number,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);