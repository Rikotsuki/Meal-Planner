const mongoose = require("mongoose");

const groceryListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealPlan",
    required: true
  },
  name: {
    type: String,
    required: true,
    default: "Grocery List"
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      // required: true,   
      default: ""         
    },
    aisle: {
      type: String,

      
      default: "General"
    },
    mealName: {
      type: String,
      default: ""
    },
    mealNames: {
      type: [String], 
      default:[]
    },
    mealCount: {
      type : Number,
      default:""
    }
  }],
  totalItems: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("GroceryList", groceryListSchema); 