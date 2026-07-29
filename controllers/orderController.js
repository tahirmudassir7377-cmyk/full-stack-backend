const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };