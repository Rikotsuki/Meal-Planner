const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { signup, login, me, verifyEmail, refresh, forgetPassword } = require("../services/auth.services");
const { verfiyEmailDto, registerReqDto, loginReqDto } = require("../dto/auth.dto");
const validate = require("../middleware/validator");

const router = express.Router();

router.post("/signup",validate(registerReqDto), signup);

router.post("/login",validate(loginReqDto), login);

router.get("/me", auth, me);
router.post("/verifyEmail",validate(verfiyEmailDto),verifyEmail);
router.post("/refresh",refresh);
router.post("/forgetPassword",forgetPassword);
router.post("/verifyForgetPasswordToken");

module.exports = router;
