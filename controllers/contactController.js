const Contact = require("../models/Contact");

const createContactMessage = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const message = req.body.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const contact = await Contact.create({ name, email, message });

    return res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createContactMessage, getAllContactMessages };