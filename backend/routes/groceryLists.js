const express = require("express");
const auth = require("../middleware/auth");
const GroceryList = require("../models/groceryList");
const MealPlan = require("../models/mealPlan");

const router = express.Router();

// Get all grocery lists for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const groceryLists = await GroceryList.find({ userId: req.user })
      .populate('mealPlanId', 'name description')
      .sort({ createdAt: -1 });
    
    res.json(groceryLists);
  } catch (error) {
    console.error("Get grocery lists error:", error);
    res.status(500).json({ message: "Error fetching grocery lists" });
  }
});

// Get a specific grocery list
router.get("/:id", auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOne({ 
      _id: req.params.id, 
      userId: req.user 
    }).populate('mealPlanId', 'name description mealNames');
    
    if (!groceryList) {
      return res.status(404).json({ message: "Grocery list not found" });
    }
    
    res.json(groceryList);
  } catch (error) {
    console.error("Get grocery list error:", error);
    res.status(500).json({ message: "Error fetching grocery list" });
  }
});

// Update a grocery list
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, items } = req.body;
    
    const groceryList = await GroceryList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { name, items, totalItems: items ? items.length : 0 },
      { new: true }
    );
    
    if (!groceryList) {
      return res.status(404).json({ message: "Grocery list not found" });
    }
    
    res.json(groceryList);
  } catch (error) {
    console.error("Update grocery list error:", error);
    res.status(500).json({ message: "Error updating grocery list" });
  }
});

// Delete a grocery list
router.delete("/:id", auth, async (req, res) => {
  try {
    const groceryList = await GroceryList.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user 
    });
    
    if (!groceryList) {
      return res.status(404).json({ message: "Grocery list not found" });
    }
    
    res.json({ message: "Grocery list deleted successfully" });
  } catch (error) {
    console.error("Delete grocery list error:", error);
    res.status(500).json({ message: "Error deleting grocery list" });
  }
});

// Create grocery list from meal plan
router.post("/from-meal-plan/:mealPlanId", auth, async (req, res) => {
  try {
    const { mealPlanId } = req.params;
    
    // Find the meal plan
    const mealPlan = await MealPlan.findOne({ 
      _id: mealPlanId, 
      userId: req.user 
    });
    
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    
    // Generate realistic grocery items for each meal (excluding basic spices)
    const groceryItems = [];
    
    mealPlan.mealNames.forEach((mealName, index) => {
      // Add meal-specific ingredients based on meal name
      if (mealName.toLowerCase().includes('chicken')) {
        groceryItems.push(
          { name: "Chicken Breast", amount: 1, unit: "lb", aisle: "Meat & Poultry", mealName: mealName },
          { name: "Bell Peppers", amount: 2, unit: "medium", aisle: "Produce", mealName: mealName },
          { name: "Broccoli", amount: 1, unit: "head", aisle: "Produce", mealName: mealName },
          { name: "Brown Rice", amount: 1, unit: "cup", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Soy Sauce", amount: 2, unit: "tbsp", aisle: "Condiments", mealName: mealName }
        );
      } else if (mealName.toLowerCase().includes('salmon')) {
        groceryItems.push(
          { name: "Salmon Fillet", amount: 1, unit: "lb", aisle: "Seafood", mealName: mealName },
          { name: "Asparagus", amount: 1, unit: "bunch", aisle: "Produce", mealName: mealName },
          { name: "Lemon", amount: 1, unit: "medium", aisle: "Produce", mealName: mealName },
          { name: "Quinoa", amount: 1, unit: "cup", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Olive Oil", amount: 2, unit: "tbsp", aisle: "Oils & Condiments", mealName: mealName }
        );
      } else if (mealName.toLowerCase().includes('pasta')) {
        groceryItems.push(
          { name: "Pasta", amount: 8, unit: "oz", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Tomatoes", amount: 4, unit: "medium", aisle: "Produce", mealName: mealName },
          { name: "Fresh Basil", amount: 1, unit: "bunch", aisle: "Produce", mealName: mealName },
          { name: "Parmesan Cheese", amount: 0.5, unit: "cup", aisle: "Dairy", mealName: mealName },
          { name: "Olive Oil", amount: 3, unit: "tbsp", aisle: "Oils & Condiments", mealName: mealName }
        );
      } else if (mealName.toLowerCase().includes('beef')) {
        groceryItems.push(
          { name: "Ground Beef", amount: 1, unit: "lb", aisle: "Meat & Poultry", mealName: mealName },
          { name: "Onion", amount: 1, unit: "large", aisle: "Produce", mealName: mealName },
          { name: "Tomato Paste", amount: 2, unit: "tbsp", aisle: "Condiments", mealName: mealName },
          { name: "Pasta", amount: 8, unit: "oz", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Mozzarella Cheese", amount: 1, unit: "cup", aisle: "Dairy", mealName: mealName }
        );
      } else if (mealName.toLowerCase().includes('vegetarian') || mealName.toLowerCase().includes('vegan')) {
        groceryItems.push(
          { name: "Chickpeas", amount: 1, unit: "can", aisle: "Canned Goods", mealName: mealName },
          { name: "Sweet Potato", amount: 2, unit: "medium", aisle: "Produce", mealName: mealName },
          { name: "Spinach", amount: 1, unit: "bunch", aisle: "Produce", mealName: mealName },
          { name: "Quinoa", amount: 1, unit: "cup", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Tahini", amount: 2, unit: "tbsp", aisle: "Condiments", mealName: mealName }
        );
      } else if (mealName.toLowerCase().includes('fish')) {
        groceryItems.push(
          { name: "White Fish Fillet", amount: 1, unit: "lb", aisle: "Seafood", mealName: mealName },
          { name: "Zucchini", amount: 2, unit: "medium", aisle: "Produce", mealName: mealName },
          { name: "Cherry Tomatoes", amount: 1, unit: "pint", aisle: "Produce", mealName: mealName },
          { name: "Couscous", amount: 1, unit: "cup", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Lemon", amount: 1, unit: "medium", aisle: "Produce", mealName: mealName }
        );
      } else {
        // Generic ingredients for other meals
        groceryItems.push(
          { name: "Mixed Vegetables", amount: 2, unit: "cups", aisle: "Produce", mealName: mealName },
          { name: "Protein Source", amount: 1, unit: "serving", aisle: "Meat & Poultry", mealName: mealName },
          { name: "Whole Grain", amount: 1, unit: "cup", aisle: "Grains & Pasta", mealName: mealName },
          { name: "Healthy Fat", amount: 1, unit: "tbsp", aisle: "Oils & Condiments", mealName: mealName },
          { name: "Fresh Herbs", amount: 1, unit: "bunch", aisle: "Produce", mealName: mealName }
        );
      }
    });
    
    // Create the grocery list
    const groceryList = new GroceryList({
      userId: req.user,
      mealPlanId: mealPlan._id,
      name: `Grocery List - ${mealPlan.name}`,
      items: groceryItems,
      totalItems: groceryItems.length
    });
    
    const savedGroceryList = await groceryList.save();
    
    res.status(201).json(savedGroceryList);
  } catch (error) {
    console.error("Create grocery list from meal plan error:", error);
    res.status(500).json({ message: "Error creating grocery list" });
  }
});

module.exports = router; 