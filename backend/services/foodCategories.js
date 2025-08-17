const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const FoodCategory=require("../models/foodCategories");

const getFoodCategoryByType=async (req,res)=>{
    const {type}=req.query;
    console.log(req);
    console.log("Type:", type);
    try {
        if (!type) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Type query parameter is required" });
        }

        const foodCategories = await FoodCategory.find({ type }).populate("recipeId");
        
        if (foodCategories.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No food categories found for the specified type" });
        }

        res.status(StatusCodes.OK).json(foodCategories);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching food categories" });
    }
}
module.exports={
    getFoodCategoryByType 
}
