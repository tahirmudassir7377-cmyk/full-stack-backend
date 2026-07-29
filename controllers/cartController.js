const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    const populatedCart = await cart.populate("items.product", "name price image stock");

    return res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const populatedCart = await cart.populate("items.product", "name price image stock");

    return res.status(200).json(populatedCart);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();

    const populatedCart = await cart.populate("items.product", "name price image stock");

    return res.status(200).json(populatedCart);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };