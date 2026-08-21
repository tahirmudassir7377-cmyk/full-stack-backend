const express = require("express");
const router = express.Router();
const { createContactMessage, getAllContactMessages } = require("../controllers/contactController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.post("/", createContactMessage);
router.get("/", protect, isAdmin, getAllContactMessages);

module.exports = router;