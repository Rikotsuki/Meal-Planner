 const nodemailer = require("nodemailer");
  require("dotenv").config();
  
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
 service:"gmail", // true for 465, false for other ports
  auth: {
    user: "almonyuri656@gmail.com",
    pass: process.env.mealplannerpw,
  },
});

// Wrap in an async IIFE so we can use await.
const sendEmail= async (email,code,isForgetPassword=false) => {
  const subject =isForgetPassword?"Reset Password - Meal Planner": "Email Verification - Meal Planner";
  const htmlContent = isForgetPassword?`
    <div
      style="
        
        padding: 20px;
        width: 400px;
        height: 400px;
      "
    >

      <p style="margin-bottom:4px">Hello, Use the following code to change your password:</p>
      <p style="font-size: 32px; color: #31ed3d;margin-bottom:4px">${code}</p>

      <p style="margin-bottom:4px">This code is valid for 30 minutes.</p>
      <p style="margin-bottom:4px">If you didn’t request this, you can ignore this email.</p>

      <p>Meal Planner. Inc</p>
    </div>
    `:`
    <div
      style="
        
        padding: 20px;
        width: 400px;
        height: 400px;
      "
    >

      <p style="margin-bottom:4px">Hello, Use the following code to verify your email:</p>
      <p style="font-size: 32px; color: #31ed3d;margin-bottom:4px">${code}</p>

      <p style="margin-bottom:4px">This code is valid for 30 minutes.</p>
      <p style="margin-bottom:4px">If you didn’t request this, you can ignore this email.</p>

      <p>Meal Planner. Inc</p>
    </div>
    `;
  const info = await transporter.sendMail({
    from: '"MealPlanner" <mealplanner@gmail.com>',
    to: email,
    subject, // Subject line
    text: "Hello world?", // plain‑text body
    html:htmlContent, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

module.exports = { sendEmail };
