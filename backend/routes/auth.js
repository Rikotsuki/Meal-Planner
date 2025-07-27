const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { signup, login, me, verifyEmail } = require("../services/auth.services");
const { verfiyEmailDto, registerReqDto, loginReqDto } = require("../dto/auth.dto");
const validate = require("../middleware/validator");

const router = express.Router();

router.post("/signup",validate(registerReqDto), signup);

router.post("/login",validate(loginReqDto), login);

router.get("/me", auth, me);
router.post("/verifyEmail",validate(verfiyEmailDto),verifyEmail);
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
