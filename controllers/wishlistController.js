const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products",
      "name price image stock"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
      const exists = wishlist.products.some((p) => p.toString() === productId);

      if (exists) {
        wishlist.products = wishlist.products.filter(
          (p) => p.toString() !== productId
        );
      } else {
        wishlist.products.push(productId);
      }

      await wishlist.save();
    }

    const populatedWishlist = await wishlist.populate("products", "name price image stock");

    return res.status(200).json(populatedWishlist);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWishlist, toggleWishlist };