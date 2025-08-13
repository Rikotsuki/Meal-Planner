const express = require("express");
const auth = require("../middleware/auth");
const MealPlan = require("../models/mealPlan");
const DailyMealPlan = require("../models/dailyMealPlan");

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Meal plans route is working" });
});

// Test auth endpoint
router.get("/test-auth", auth, (req, res) => {
  res.json({ 
    message: "Auth is working", 
    userId: req.user,
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Not Set"
  });
});

// Create a new meal plan
router.post("/", auth, async (req, res) => {
  try {
    console.log("=== MEAL PLAN CREATION START ===");
    console.log("Request body:", req.body);
    console.log("User ID:", req.user);
    
    const { name, description, startDate, endDate, preferences, mealNames } = req.body;
    
    console.log("Creating meal plan with data:", {
      userId: req.user,
      name,
      description,
      startDate,
      endDate,
      preferences,
      mealNamesCount: mealNames?.length || 0
    });
    
    // Validate required fields
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["name", "startDate", "endDate"]
      });
    }
    
    console.log("Meal names to save:", mealNames);
    
    const mealPlan = new MealPlan({
      userId: req.user,
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      preferences,
      mealNames: mealNames || []
    });

    console.log("Meal plan object created:", mealPlan);
    
    const savedMealPlan = await mealPlan.save();
    console.log("Meal plan saved successfully:", savedMealPlan._id);
    console.log("=== MEAL PLAN CREATION END ===");
    
    res.status(201).json(savedMealPlan);
  } catch (error) {
    console.error("=== MEAL PLAN CREATION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: "Error creating meal plan",
      error: error.message 
    });
  }
});

// Get all meal plans for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    console.log("Fetching meal plans for user:", req.user);
    const mealPlans = await MealPlan.find({ userId: req.user })
      .populate('dailyPlans')
      .sort({ createdAt: -1 });
    
    console.log("Found meal plans:", mealPlans);
    res.json(mealPlans);
  } catch (error) {
    console.error("Get meal plans error:", error);
    res.status(500).json({ message: "Error fetching meal plans" });
  }
});

// Get a specific meal plan
router.get("/:id", auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ 
      _id: req.params.id, 
      userId: req.user 
    }).populate('dailyPlans');
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    
    res.json(mealPlan);
  } catch (error) {
    console.error("Get meal plan error:", error);
    res.status(500).json({ message: "Error fetching meal plan" });
  }
});

// Update a meal plan
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, preferences, dailyPlans } = req.body;
    
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { name, description, startDate, endDate, preferences, dailyPlans },
      { new: true }
    );
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    
    res.json(mealPlan);
  } catch (error) {
    console.error("Update meal plan error:", error);
    res.status(500).json({ message: "Error updating meal plan" });
  }
});

// Delete a meal plan
router.delete("/:id", auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user 
    });
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    
    // Also delete associated daily meal plans
    await DailyMealPlan.deleteMany({ mealPlanId: req.params.id });
    
    res.json({ message: "Meal plan deleted successfully" });
  } catch (error) {
    console.error("Delete meal plan error:", error);
    res.status(500).json({ message: "Error deleting meal plan" });
  }
});

// Generate grocery list from meal plan
router.post("/:id/grocery-list", auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ 
      _id: req.params.id, 
      userId: req.user 
    }).populate('dailyPlans');
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    
    // Extract all ingredients from daily meal plans
    const ingredients = new Map();
    
    mealPlan.dailyPlans.forEach(dailyPlan => {
      dailyPlan.meals.forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          if (ingredients.has(key)) {
            ingredients.get(key).amount += ingredient.amount;
          } else {
            ingredients.set(key, {
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              aisle: ingredient.aisle
            });
          }
        });
      });
    });
    
    const groceryList = {
      mealPlanId: mealPlan._id,
      userId: req.user,
      items: Array.from(ingredients.values()),
      createdAt: new Date()
    };
    
    res.json(groceryList);
  } catch (error) {
    console.error("Generate grocery list error:", error);
    res.status(500).json({ message: "Error generating grocery list" });
  }
});

module.exports = router; 