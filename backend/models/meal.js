const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    calories: {
        type: Number,
    },
    items: [{
        name: {
            type: String,
        },
        servings: {
            type: Number,
            min: 0.1
        },
        image: {
            type: String,
        },
        isServed: {
            type: Boolean,
            default: false
        },
        
    }]
});

module.exports = mongoose.model("Meal", mealSchema);