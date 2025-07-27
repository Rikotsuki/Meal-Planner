const mongoose= require("mongoose");
const profileSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    age: { 
      type: Number,
      min: 0,
      max: 120,
    },
    gender: { 
      type: String, 
      enum: ["male", "female", "other"] 
    },
    weight: { 
      type: Number,
      min: 0,
      max: 1000,
      unit: { 
        type: String, 
        enum: ["kg", "lb"], 
        default: "kg"
      }
    },
    height: {
      type: Number,
      min: 0,
      max: 300,
      unit: { 
        type: String, 
        enum: ["cm", "in", "ft"],
        default: "cm"
      }
    },
    allergies: [{ 
      type: String 
    }],
    goal: { 
      type: String, 
      enum: ["lose", "maintain", "gain"] 
    },
    preferredDiet: { 
      type: String 
    },
    mealsPerDay: { 
      type: Number,
      min: 1,
      max: 12,
    },
    calorieIntake: { 
      type: Number,
      min: 0,
      max: 10000,
    },
    carbs: { 
      type: Number,
      min: 0,
      max: 1000,
    },
    fat: { 
      type: Number,
      min: 0,
      max: 1000,
    },
    protein: { 
      type: Number,
      min: 0,
      max: 1000,
    },
});