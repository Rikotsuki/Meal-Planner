// routes/bmi.routes.js
const express = require('express');
const router = express.Router();
const { calculateUserBMI } = require('../services/bmi.services');
const User = require('../models/User');

// POST /api/bmi/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Run logic
    const updatedUser = await calculateUserBMI(user);

    res.json({ message: 'BMI calculated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/bmi/test-user
router.post('/test-user', async (req, res) => {
  try {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      age: 28,
      gender: 'female',
      height: 160,
      weight: 60,
      activityLevel: 'moderate',
      goal: 'maintain'
    });

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create test user' });
  }
});

module.exports = router;