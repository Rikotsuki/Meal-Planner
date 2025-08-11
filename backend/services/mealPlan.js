const { StatusCodes } = require("http-status-codes");
const Profile = require("../models/profile");
const { getWeeklyPlan, getDailyPlan } = require("../shared/aiApi");
const MealPlan = require("../models/mealPlan");
const Meal = require("../models/meal");
const generateMealPlan = async (req, res) => {
  try {
    const { weekly } = req.query;
    const userId = req.user;
    const profile = await Profile.findOne({ userId });
    const latestMealPlan = await MealPlan.findOne()
      .sort({ date: -1 })
      .select("date") // sort by date descending
      .exec();
    // Log the latest meal plan for debugging
    let requestDate;
    if (latestMealPlan?.date) {
      const currentDate = new Date(latestMealPlan.date);
      requestDate = new Date(currentDate);
      requestDate.setDate(currentDate.getDate() + 1);
    } else {
      requestDate = new Date();
    }

    

    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profile not found" });
    }

    const mealPlan = weekly
      ? await getWeeklyPlan(profile, requestDate)
      : await getDailyPlan(profile, requestDate);
    

   if(weekly){
    await saveWeeklyPlanToDB(mealPlan, userId,res);
   }else{
    await saveDailyToDb(mealPlan, userId, res);
   }
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error generating meal plan" });
  }
};

const saveDailyToDb = async (data,userId,res) => {
  try {
    // Step 1: Save meals individually
    const savedMeals = await Promise.all(
      data.meals.map((meal) => {
        const newMeal = new Meal({
          name: meal.name,
          calories: meal.calories,
          items: meal.items,
        });
        return newMeal.save();
      })
    );
    console.log(savedMeals);
    // Step 2: Save the meal plan referencing savedMeals IDs
    const newMealPlan = new MealPlan({
      userId: userId,
      date: new Date(data.date), // convert string to Date
      totalCalories: data.caloriesTotal,
      meals: savedMeals.map((m) => m._id), // store only ObjectIds
      nutrition: data.nutrition,
    });

    await newMealPlan.save();
    console.log("Daily meal plan saved to database successfully");
    res.status(StatusCodes.CREATED).json({
      message: "Daily meal plan saved successfully",
      mealPlan: newMealPlan,
    });
  } catch (error) {
    console.error("Error saving daily meal plan to database:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error saving daily meal plan" });
  }
};
const saveWeeklyPlanToDB = async (plansArray, userId,res) => {
  try {
    for (const plan of plansArray) {
      // 1️⃣ Save all meals for this day
      const savedMeals = await Promise.all(
        plan.meals.map((meal) => {
          const newMeal = new Meal({
            name: meal.name,
            calories: meal.calories,
            items: meal.items,
          });
          return newMeal.save();
        })
      );

      // 2️⃣ Save the meal plan for this day
      const newMealPlan = new MealPlan({
        userId,
        date: new Date(plan.date),
        totalCalories: plan.caloriesTotal,
        meals: savedMeals.map((m) => m._id),
        nutrition: plan.nutrition,
      });

      await newMealPlan.save();
    }
    res.status(StatusCodes.CREATED).json({
      message: "Weekly meal plans saved successfully",
    });
  } catch (error) {
    console.error("Error saving weekly meal plans to database:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error saving weekly meal plans",
    });
    console.log("All meal plans saved successfully");
  }
};

module.exports = {
  generateMealPlan,
};
