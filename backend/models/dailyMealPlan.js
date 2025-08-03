const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    caloriesTotal: {
        type: Number,
    },
    meals: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Meal", 
        required: true 
    }],
    nutrition: {
        totals: {
            calories: {
                type: Number,
            },
            carbs:{
                type: Number,
            },
            fat: {
                type: Number,
            },
            protein: {
                type: Number,
            },
            fiber: {
                type: Number,
            },
            sodium: {
                type: Number,
            },
            cholesterol: {
                type: Number,
            },
        },
        targets: {
            calories: {
                type: Number,
            },
            carbs: {
                min: {
                    type: Number,
                },
                max: {
                    type: Number,
                },
            },
            fat: {
                min: {
                    type: Number,
                },
                max: {
                    type: Number,
                },
            },
            protein: {
                min: {
                    type: Number,
                },
                max: {
                    type: Number,
                },
            },
            fiber: {
                type: Number,
            },
        },
        macrosPercent: {
            fat: {
                type: Number,
            },
            carbs: {
                type: Number,
            },
            protein: {
                type: Number,
            },
        },
    }
});

module.exports = mongoose.model("DailyNutrition", nutritionSchema);