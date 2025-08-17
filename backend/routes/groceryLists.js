const express = require("express");
const auth = require("../middleware/auth");
const GroceryList = require("../models/groceryList");
const MealPlan = require("../models/mealPlan");

const router = express.Router();

// fixed 

const axios = require("axios");
const pLimit = require("p-limit");
const mongoose = require("mongoose");

const SPOON_BASE = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;
const limit = pLimit(5); 

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const normalizeKey = (s) => String(s || "").trim().toLowerCase();

// Do NOT merge; just normalize so saves never fail
function keepItemsAsIs(items) {
  return (items || []).map((it) => ({
    ...it,
    amount: Number(it.amount ?? 0),
    unit: (it.unit || "").trim() || "count", // safe fallback
    aisle: it.aisle || "General",
  }));
}

// Back-compat alias (in case some code still calls mergeItems)
const mergeItems = keepItemsAsIs;


async function searchRecipeIdByQuery(query) {
  const { data } = await axios.get(`${SPOON_BASE}/recipes/complexSearch`, {
    params: { apiKey: API_KEY, query, number: 1 }
  });
  return data?.results?.[0]?.id || null;
}

async function fetchRecipeInfo(recipeId) {
  const { data } = await axios.get(`${SPOON_BASE}/recipes/${recipeId}/information`, {
    params: { apiKey: API_KEY, includeNutrition: false }
  });
  return data;
}

function mapExtendedIngredients(extendedIngredients, mealTitle) {
  return (extendedIngredients || []).map((ing) => {
    const metric = ing.measures?.metric;
    const us = ing.measures?.us;
    const amount = metric?.amount ?? us?.amount ?? ing.amount ?? 1;
    const unit =
      metric?.unitShort || metric?.unitLong ||
      us?.unitShort || us?.unitLong ||
      (ing.unit || "").trim() || "count";   // <- keep "count" fallback

    return {
      name: ing.nameClean || ing.name || ing.originalName,
      amount: Number(amount) || 1,
      unit,
      aisle: ing.aisle || "General",
      mealName: mealTitle,                  // single meal name only
    };
  });
}



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

// Update a grocery list (replace name/items; no merging)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid list id" });

    const { name, items } = req.body;

    const update = {};
    if (typeof name === "string") update.name = name;

    if (Array.isArray(items)) {
      // keep items as-is, just normalize for safety (amount number, unit fallback, aisle default)
      const normalized = keepItemsAsIs(items);
      update.items = normalized;
      update.totalItems = normalized.length;
    }

    const groceryList = await GroceryList.findOneAndUpdate(
      { _id: id, userId: req.user },
      update,
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
// Create grocery list from meal plan using Spoonacular (no generic fallback)
router.post("/from-meal-plan/:mealPlanId", auth, async (req, res) => {
  try {
    const { mealPlanId } = req.params;
    if (!isValidId(mealPlanId)) {
      return res.status(400).json({ message: "Invalid mealPlanId" });
    }
    if (!API_KEY) {
      return res.status(500).json({ message: "Missing SPOONACULAR_API_KEY in env" });
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId: req.user }).lean();
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    // Prevent duplicate list per meal plan (optional but handy)
    const existing = await GroceryList.findOne({ mealPlanId, userId: req.user }).lean();
    if (existing) {
      return res.status(409).json({
        message: "Grocery list for this meal plan already exists",
        listId: existing._id
      });
    }

    const mealNames = mealPlan.mealNames || [];
    if (!mealNames.length) {
      return res.status(400).json({ message: "Meal plan has no meal names" });
    }

    // For each meal name: find recipe ID, fetch info, map to ingredients
    const jobs = mealNames.map((title) =>
      limit(async () => {
        const recipeId = await searchRecipeIdByQuery(title);
        if (!recipeId) return []; // skip if not found
        const info = await fetchRecipeInfo(recipeId);
        return mapExtendedIngredients(info.extendedIngredients, info.title || title);
      })
    );

    const results = await Promise.all(jobs);
    const rawItems = results.flat();

    if (!rawItems.length) {
      // Strict: no generic fallback — fail with a helpful message
      return res.status(400).json({
        message: "Could not resolve real ingredients for any meals. Try more specific meal names."
      });
    }

    const groceryItems = keepItemsAsIs(rawItems);

    const groceryList = await GroceryList.create({
      userId: req.user,
      mealPlanId: mealPlan._id,
      name: `Grocery List - ${mealPlan.name}`,
      items: groceryItems,
      totalItems: groceryItems.length
    });

    res.status(201).json(groceryList);
  } catch (error) {
    console.error("Create grocery list (Spoonacular) error:", error?.response?.data || error);
    res.status(500).json({ message: "Error creating grocery list from Spoonacular" });
  }
});

module.exports = router; 