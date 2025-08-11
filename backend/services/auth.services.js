const { generateToken } = require("../shared/auth");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const user = require("../models/user");
const { sendEmail } = require("../services/emailService");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }
    const emailToken = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code
    // Create new user
    const user = new User({
      name,
      email,
      password,
      emailVerificationToken: emailToken,
      verifyTokenExpireAt: new Date(new Date().getTime() + 30 * 60 * 1000),
    });

    await user.save();
    await require("../services/emailService").sendEmail(email, emailToken);

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = generateToken(user._id);
    const refreshToken = generateToken(user._id, "7d");
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        emailVerifiedAt: user.emailVerifiedAt
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user).select(
      "_id name email avatar emailVerifyAt"
    );

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const currentTime = new Date();
    if (user.verifyTokenExpireAt < currentTime) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Verification code expired" });
    }
    // Check if the code matches
    if (user.emailVerificationToken !== code) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid verification code" });
    }
    // Update user to mark email as verified
    user.emailVerifiedAt = true;
    user.emailVerificationToken = null;

    user.verifyTokenExpireAt = null; // Clear the expiration time

    const accessToken = generateToken(user._id);
    const refreshToken = generateToken(user._id, "7d");
    user.refreshToken = refreshToken;
    await user.save();
    res.status(StatusCodes.OK).json({
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        emailVerifiedAt: user.emailVerifiedAt
      }
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  console.log("Refresh token:", refreshToken);
  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Refresh token is required" });
  }
  const user = await User.findOne({ refreshToken });
  console.log(user)
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User not found or invalid refresh token" });
  }

  if (user.refreshToken !== refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid refresh token" });
  }
  const newAccessToken = generateToken(user._id);
  const newRefreshToken = generateToken(user._id, "7d");
  user.refreshToken = newRefreshToken;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }

  const resetPasswordToken = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordTokenExpireAt = new Date(
    new Date().getTime() + 30 * 60 * 1000
  ); 
  
  // Token valid for 30 minutes
  await user.save();
  await sendEmail(email, resetPasswordToken, true);
  res
    .status(StatusCodes.OK)
    .json({ message: "Reset password token sent to email" });
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    console.log("User found:", user);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    user.refreshToken = null; // Clear the refresh token
    await user.save();
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
  me,
  verifyEmail,
  refresh,
  forgetPassword,
  logout,
};
