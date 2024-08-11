const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
