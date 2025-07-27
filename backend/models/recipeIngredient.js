 const mongoose = require("mongoose");

const recipeIngredientSchema = new mongoose.Schema({
  ingredientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Ingredient", 
    required: true 
  },
  amount: { 
    type: Number 
  },
  unit: { 
    type: String 
  },
  preparation: { 
    type: String 
  }
});

module.exports = mongoose.model("RecipeIngredient", recipeIngredientSchema);