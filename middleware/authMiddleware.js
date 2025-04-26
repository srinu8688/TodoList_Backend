const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.JWT_SECRET;
const authMiddleware = async (req, res, next) => {
   const token = req.headers.token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
