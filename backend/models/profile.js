const mongoose = require("mongoose");
const { act, Profiler } = require("react");
const { string, object } = require("zod");

const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  weight: {
    type: Number,
    min: 0,
    max: 1000,
    unit: {
      type: String,
      enum: ["kg", "lb"],
      default: "kg",
    },
  },
  height: {
    type: Number,
    min: 0,
    max: 300,
    unit: {
      type: String,
      enum: ["cm", "in", "ft"],
      default: "cm",
    },
  },
  bodyFat: {
    type: String,
    enum: ["Low", "Normal", "High"],
    default: "Normal",
  },
  activityLevel: {
    type: String,
    enum: ["very light", "light", "active", "very active", "extremely active"],
    default: "light",
  },
  allergies: [
    {
      type: String,
    },
  ],
  goal: {
    type: String,
    enum: ["lose", "maintain", "gain"],
  },
  preferredDiet: {
    type: String,
  },
  mealsInDay: [
    {
      mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "supper","snack"],
    },
    foodCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodCategory",
      },
    ]
  }
  ],
  calorieIntake: {
    type: Number,
    min: 0,
    max: 10000,
  },
  carbs: {
    from: { type: Number, required: true ,min: 0, max: 1000},
    to: { type: Number, required: false,max: 1000},
  },
  fat: {
    from: { type: Number, required: true ,min: 0, max: 1000},
    to: { type: Number, required: false,max: 1000},
  },
  protein: {
    from: { type: Number, required: true ,min: 0, max: 1000},
    to: { type: Number, required: false,max: 1000},
  },
});

module.exports = mongoose.model("Profile", profileSchema);