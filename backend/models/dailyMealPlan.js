const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    caloriesTotal: {
        type: Number,
        default: 0
    },
    nutrition: {
        totals: {
            calories: {
                type: Number,
                default: 0
            },
            carbs:{
                type: Number,
                default: 0
            },
            fat: {
                type: Number,
                default: 0
            },
            protein: {
                type: Number,
                default: 0
            },
            fiber: {
                type: Number,
                default: 0
            },
            sodium: {
                type: Number,
                default: 0
            },
            cholesterol: {
                type: Number,
                default: 0
            },
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("DailyNutrition", nutritionSchema);