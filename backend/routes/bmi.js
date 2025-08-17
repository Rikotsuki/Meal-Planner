const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const { calculateUserBMI, calculateTDEE } = require('../services/bmi.services');

const router = express.Router();
const bmr = ({ gender, weight, height, age }) =>
  !weight||!height||!age ? null :
  (gender==='male'
    ? 10*weight + 6.25*height - 5*age + 5
    : 10*weight + 6.25*height - 5*age - 161);

router.put('/', auth, async (req,res)=>{
  try{
    const u = await User.findById(req.user);
    if(!u) return res.status(404).json({message:'User not found'});

    // optional updates from body
    const { goal, activityLevel, height, weight, age, gender } = req.body || {};
    if(goal) u.goal = goal;
    if(activityLevel) u.activityLevel = activityLevel;
    if(height!=null) u.height = Number(height);
    if(weight!=null) u.weight = Number(weight);
    if(age!=null)    u.age    = Number(age);
    if(gender)       u.gender = gender;

    const saved = await calculateUserBMI(u);

    const _bmr = bmr({ gender:saved.gender, weight:saved.weight, height:saved.height, age:saved.age });
    const _tdee = calculateTDEE(_bmr, saved.activityLevel);

    res.json({
      message:'BMI calculated & saved',
      user:{
        id:saved._id, name:saved.name,
        bmi:saved.bmi, dailyCalories:saved.dailyCalories,
        goal:saved.goal, activityLevel:saved.activityLevel
      },
      metrics:{ bmr:_bmr, tdee:_tdee, bmi:saved.bmi, dailyCalories:saved.dailyCalories }
    });
  }catch(err){
    console.error('BMI PUT error', err);
    res.status(500).json({message:'Error calculating BMI'});
  }
});

module.exports = router;
