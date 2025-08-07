const profile = require("../models/profile");

 const getWeeklyPlan=async(profile)=>{ 
    try{
        const response = await fetch(`${process.env.AI_API_URL}/generateWeeklyPlan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ profile }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate meal plan");
        }

        const data = await response.json();
        return data;
    }catch(error){

    }

 }

 module.exports = {
    getWeeklyPlan,
 }