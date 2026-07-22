const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getProfile,
  verifyEmail,
  resendVerification,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/resend-verification", resendVerification);
router.get("/profile", protect, getProfile);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;