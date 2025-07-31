const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  image: {
    type: String,
    default: "default-recipe-image.jpg"    //Default image placeholder
  },
  dishtype: {
    type: String,
    enum: ["Main Dish", "Side Dish"],
    required: true
  },
  suitableFor: [{
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
    required: true
  }],
  goodLeftovers: {
    type: Boolean,
    default: true
  },
  prepTime: { 
    type: Number,
    required: true,
    default: 1
  },
  cookTime: { 
    type: Number,
    required: true,
    default: 1
  },
  yields: { 
    type: Number,
    required: true,
    default: 1
  },
  servingDescription: { 
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      default: "serving"
    },
  },
  canBeSingleServing: {
    type: Boolean,
    default: true,
  },
  ingredients: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "RecipeIngredient" 
  }], 
  directions: [{
    type: String 
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Recipe", recipeSchema);