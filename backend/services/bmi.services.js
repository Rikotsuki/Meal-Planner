// services/bmi.services.js
const User = require('../models/user');

const ACTIVITY_MULT = { low: 1.2, moderate: 1.55, high: 1.9 };

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function calculateBMI(weightKg, heightCm) {
  const w = Number(weightKg);
  const h = Number(heightCm);
  if (!w || !h || h <= 0) return null;
  const bmi = w / Math.pow(h / 100, 2);
  return round2(bmi);
}

function calculateBMR({ gender, weight, height, age }) {
  const w = Number(weight), h = Number(height), a = Number(age);
  if (!w || !h || !a || !gender) return null;
  // Mifflin–St Jeor
  return gender === 'male'
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;
}

function calculateTDEE(bmr, activityLevel = 'moderate') {
  if (!bmr) return null;
  const mult = ACTIVITY_MULT[activityLevel] ?? ACTIVITY_MULT.moderate;
  return Math.round(bmr * mult);
}

/**
 * Recalculate BMI/TDEE/dailyCalories for a user doc.
 * @param {Document|Object} user Mongoose user doc (preferred) or plain object with needed fields.
 * @param {{save?: boolean, sanitize?: boolean}} opts
 * @returns {Promise<any>} updated user (doc or plain object depending on sanitize)
 */
async function calculateUserBMI(user, opts = {}) {
  const { save = true, sanitize = false } = opts;

  // BMI
  const bmi = calculateBMI(user.weight, user.height);
  user.bmi = bmi;

  // BMR/TDEE
  const bmr = calculateBMR({
    gender: user.gender,
    weight: user.weight,
    height: user.height,
    age: user.age,
  });

  const tdee = calculateTDEE(bmr, user.activityLevel);
  let daily = tdee;

  // Goal adjust only if we have a base TDEE
  if (tdee) {
    if (user.goal === 'lose') daily = tdee - 500;
    else if (user.goal === 'gain') daily = tdee + 500;
  }

  user.dailyCalories = daily ?? null;

  // Optional: guard against negative or absurd values (comment out if you don’t want constraints)
  if (user.dailyCalories && user.dailyCalories < 800) user.dailyCalories = 800; // safety floor
  if (user.dailyCalories && user.dailyCalories > 6000) user.dailyCalories = 6000; // sanity cap

  if (save && typeof user.save === 'function') {
    await user.save();
  }

  return sanitize && typeof user.toJSON === 'function' ? user.toJSON() : user;
}

module.exports = {
  calculateUserBMI,
  calculateBMI,   // exported for unit tests if you add them
  calculateTDEE,  // ^
};
