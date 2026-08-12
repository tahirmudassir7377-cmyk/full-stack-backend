const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
} = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get("/dashboard", protect, isAdmin, getDashboardStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id/role", protect, isAdmin, updateUserRole);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.get("/orders", protect, isAdmin, getAllOrders);

module.exports = router;