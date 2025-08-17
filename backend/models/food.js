const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "default-food-image.jpg"    //Default image placeholder
    },
    servingSize: [{
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
    }],
    servingPerPackage: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number
    },
    calories: {
        type: Number
    },
    carbs: {
        type: Number
    },
    fats: {
        type: Number
    },
    protein: {
        type: Number
    }
    // To add optional nutritional values if needed
});

module.exports = mongoose.model("Food", foodSchema);