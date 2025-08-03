const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema({
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
            min: 1
        },
        image: {
            type: String,
        }
    }]
});

module.exports = mongoose.model("Meal", mealSchema);