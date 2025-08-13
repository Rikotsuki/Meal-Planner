const express = require("express");
const auth = require("../middleware/auth");
const DailyMealPlan = require("../models/dailyMealPlan");

const router = express.Router();

// Track daily nutrition
router.post("/daily", auth, async (req, res) => {
  try {
    const { date, calories, carbs, fat, protein, fiber, sodium, cholesterol } = req.body;
    
    const dailyNutrition = new DailyMealPlan({
      userId: req.user,
      date,
      caloriesTotal: calories,
      nutrition: {
        totals: {
          calories,
          carbs,
          fat,
          protein,
          fiber,
          sodium,
          cholesterol
        }
      }
    });

    await dailyNutrition.save();
    res.status(201).json(dailyNutrition);
  } catch (error) {
    console.error("Track daily nutrition error:", error);
    res.status(500).json({ message: "Error tracking nutrition" });
  }
});

// Get nutrition history
router.get("/history", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.user };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const nutritionHistory = await DailyMealPlan.find(query)
      .sort({ date: -1 });
    
    res.json(nutritionHistory);
  } catch (error) {
    console.error("Get nutrition history error:", error);
    res.status(500).json({ message: "Error fetching nutrition history" });
  }
});

// Get nutrition summary for a period
router.get("/summary/:period", auth, async (req, res) => {
  try {
    const { period } = req.params;
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ message: "Invalid period" });
    }
    
    const nutritionData = await DailyMealPlan.find({
      userId: req.user,
      date: { $gte: startDate, $lte: now }
    });
    
    // Calculate averages
    const totalDays = nutritionData.length;
    const summary = {
      period,
      totalDays,
      averageCalories: 0,
      averageCarbs: 0,
      averageFat: 0,
      averageProtein: 0,
      averageFiber: 0
    };
    
    if (totalDays > 0) {
      nutritionData.forEach(day => {
        summary.averageCalories += day.nutrition.totals.calories || 0;
        summary.averageCarbs += day.nutrition.totals.carbs || 0;
        summary.averageFat += day.nutrition.totals.fat || 0;
        summary.averageProtein += day.nutrition.totals.protein || 0;
        summary.averageFiber += day.nutrition.totals.fiber || 0;
      });
      
      summary.averageCalories = Math.round(summary.averageCalories / totalDays);
      summary.averageCarbs = Math.round(summary.averageCarbs / totalDays);
      summary.averageFat = Math.round(summary.averageFat / totalDays);
      summary.averageProtein = Math.round(summary.averageProtein / totalDays);
      summary.averageFiber = Math.round(summary.averageFiber / totalDays);
    }
    
    res.json(summary);
  } catch (error) {
    console.error("Get nutrition summary error:", error);
    res.status(500).json({ message: "Error fetching nutrition summary" });
  }
});

module.exports = router; 