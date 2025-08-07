const {StatusCodes} = require("http-status-codes");
const Profile = require("../models/profile");
const {getWeeklyPlan} = require("../shared/aiApi");
const generateMealPlan = async (req, res) => {
  try {
    const userId = req.user;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profile not found" });
    }
    const mealPlan = await getWeeklyPlan(profile);
    console.log("Meal Plan:", mealPlan);
    res
      .status(StatusCodes.OK)
      .json({ message: "Meal plan generated successfully", mealPlan });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error generating meal plan" });
  }
};

module.exports = {
  generateMealPlan, 
}
