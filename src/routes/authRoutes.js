const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserInfo,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getUserInfo);

module.exports = router;
