const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { generateInvoice } = require("../controllers/invoiceController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/:id/invoice", protect, generateInvoice);

module.exports = router;