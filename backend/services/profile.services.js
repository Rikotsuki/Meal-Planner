 const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const Profile = require("../models/profile");

const createProfile = async (req, res) => { 
    try{
        const userId=req.user;
        const createProfileDto=req.body;
        const profile=await Profile.create({
            userId,
            ...createProfileDto,
        })
        res.status(StatusCodes.CREATED).json({message:"Profile created successfully!",profile})
    }catch(ex){
        console.log(ex);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:ex})
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user;
        const updateProfileDto = req.body;

        const profile = await Profile.findOneAndUpdate(
            { userId },
            updateProfileDto,
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Profile not found" });
        }

        res.status(StatusCodes.OK).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error updating profile", error });
    }
}
module.exports={
    createProfile,
    updateProfile,
}