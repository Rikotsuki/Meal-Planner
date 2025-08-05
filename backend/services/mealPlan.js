const {StatusCodes} = require("http-status-codes");
const Profile = require("../models/profile");
const callToAi = require("../shared/ai");
const {getGenerateMealPlanPrompt} = require("../shared/prompt");
const generateMealPlan = async (req, res) => {
  try {
    const userId = req.user;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profile not found" });
    }
    const prompt = getGenerateMealPlanPrompt(profile);
    const mealPlan = await callToAi(prompt);
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
