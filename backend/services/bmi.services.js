// backend/services/bmi.services.js
const User = require('../models/user');

function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(2);
}

function calculateTDEE(bmr, activityLevel) {
  const multiplier = { low: 1.2, moderate: 1.55, high: 1.9 };
  if (typeof bmr !== 'number') return null;
  return Math.round(bmr * (multiplier[activityLevel] || 1.55));
}

async function calculateUserBMI(user) {
  if (!user.height || !user.weight) {
    await user.save(); // persist possible goal/activity changes
    return user;
  }

  user.bmi = calculateBMI(user.weight, user.height);

  const bmr = user.gender === 'male'
    ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;

  const tdee = calculateTDEE(bmr, user.activityLevel);

  if (user.goal === 'lose') user.dailyCalories = tdee - 500;
  else if (user.goal === 'gain') user.dailyCalories = tdee + 500;
  else user.dailyCalories = tdee;

  await user.save();
  return user;
}

module.exports = { calculateBMI, calculateTDEE, calculateUserBMI };
