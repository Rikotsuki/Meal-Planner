const mongoose = require('mongoose');
const Food = require('./Food');
const FoodCategories = require('./FoodCategories');

const mealSettingSchema = new mongoose.Schema({
    firstDayOfWeek: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true,
        default: "Monday"
    },
    sameScheduleEachDay: {
        type: Boolean,
        default: true,
    },
    nutritionTarget: {
        type: String,
        required: true
    },
    mealLayout: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        mealSize: {
            type: String,
            enum: ["Tiny meal", "Small meal", "Normal meal", "Big meal", "Huge meal"],
            required: true,
            default: "Big meal"
        },
        preferredFoodType: {
            type: String,
            enum: ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
            required: true
        },
        canCook: {
            type: String,
            enum: ["Can cook", "Can't cook", "Must cook"],
            required: true
        },
        availableTime: {
            type: String,
            enum: ["No time", "Little time", "Some time", "More time", "Lots of time", "No limit"],
            required: true,
        },
        complexity: {
            type: String,
            enum: ["Super simple", "Simple", "Moderate", "Complex"],
            required: true
        },
        foodCategories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodCategory",
            required: true
        }],
        useRecurring: {
            type: Boolean,
            default: false
        },
        applyRecurringCollections: {    // Connect with collection
            type: Boolean,
            default: false
        },
        SsipGenerating: {
            type: Boolean,
            default: false
        },
        mcronutrientFocus: {
            type: String,
            enum: ["No preference", "No carbs", "No fat", "No protein", "Less carb", "Less fat", "Less protein", "More carbs", "More fat", "More protein"],
            required: true,
            default: "No preference"
        },
        numOfPeople: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        numOfDishes: {
            type: String,
            enum: ["Auto", "1 dish", "2 dishes"],
            required: true,
            default: "Auto"
        }
    }]
});

module.exports = mongoose.model('MealSetting', mealSettingSchema);