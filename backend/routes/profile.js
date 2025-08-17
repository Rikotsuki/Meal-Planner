const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validator");
const { createProfileDto, updateProfileDto } = require("../dto/profile");
const { createProfile, updateProfile } = require("../services/profile.services");

const router = express.Router();

router.post("/",auth, validate(createProfileDto),createProfile );
router.put("/",auth, validate(updateProfileDto ),updateProfile);

module.exports=router;
