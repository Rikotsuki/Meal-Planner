const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/",
      required: false,
    },
    resetPasswordToken: {
      type: Number,
      required: false,
    },
    resetPasswordTokenExpireAt: {
      type: Date,
      default: null,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: Number,
      required: false,
    },
    emailVerifyAt: {
      type: Date,
      default: null,
      required: false,
    },
    verifyTokenExpireAt: {
      type: Date,
      default: null,
      required: false,
    },

    // 🆕 BMI-related fields
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    age: { type: Number, required: false },
    gender: { type: String, enum: ['male', 'female'], required: false },
    activityLevel: { type: String, enum: ['low', 'moderate', 'high'], required: false },
    goal: { type: String, enum: ['lose', 'gain', 'maintain'], required: false },
    bmi: { type: Number, required: false },
    dailyCalories: { type: Number, required: false }
  },
  {
    timestamps: true,
  }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


// BMI 

userSchema.pre("save", function (next) {
  if (this.weight && this.height) {
    // BMI
    const heightM = this.height / 100;
    this.bmi = +(this.weight / (heightM * heightM)).toFixed(2);

    // BMR using Mifflin-St Jeor formula
    const bmr =
      this.gender === "male"
        ? 10 * this.weight + 6.25 * this.height - 5 * this.age + 5
        : 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;

    // TDEE multiplier
    const multiplier = {
      low: 1.2,
      moderate: 1.55,
      high: 1.9,
    };
    let tdee = Math.round(bmr * (multiplier[this.activityLevel] || 1.55));

    // Adjust for goal
    if (this.goal === "lose") tdee -= 500;
    if (this.goal === "gain") tdee += 500;

    this.dailyCalories = tdee;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
