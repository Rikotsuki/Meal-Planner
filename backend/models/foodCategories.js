const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack", "dessert"],
        required: true 
    },
    image: {
        type: String,
        required: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }
})

module.exports = mongoose.model("FoodCategory", foodCategorySchema);