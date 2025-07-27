 const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String 
  }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);