const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { signup, login, me, verifyEmail, refresh, forgetPassword, logout } = require("../services/auth.services");
const { verfiyEmailDto, registerReqDto, loginReqDto, forgetPasswordDto } = require("../dto/auth.dto");
const validate = require("../middleware/validator");

const router = express.Router();

router.post("/signup",validate(registerReqDto), signup);

router.post("/login",validate(loginReqDto), login);

router.get("/me", auth, me);
router.post("/verifyEmail",validate(verfiyEmailDto),verifyEmail);
router.post("/refresh",refresh);
router.post("/forgetPassword",validate(forgetPasswordDto),forgetPassword);
router.get("/logout", auth,logout );
router.post("/verifyForgetPasswordToken");

module.exports = router;
