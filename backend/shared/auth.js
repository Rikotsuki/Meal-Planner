 const jwt = require('jsonwebtoken');
 // Generate JWT token
const generateToken = (userId,expiresIn="1d") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};
module.exports = {generateToken};