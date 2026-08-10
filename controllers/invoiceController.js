const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("ShopHub", { align: "left" });
    doc.fontSize(10).text("Invoice", { align: "left" });
    doc.moveDown();

    doc.fontSize(10).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.moveDown();

    doc.fontSize(12).text("Shipping Address:", { underline: true });
    doc.fontSize(10).text(order.shippingAddress.fullName);
    doc.text(order.shippingAddress.address);
    doc.text(`${order.shippingAddress.city}`);
    doc.text(order.shippingAddress.phone);
    doc.moveDown();

    doc.fontSize(12).text("Items:", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.name}  x${item.quantity}  -  Rs. ${item.price * item.quantity}`
        );
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total: Rs. ${order.totalAmount}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Invoice generation error:", error);
    return res.status(500).json({ message: "Failed to generate invoice" });
  }
};

module.exports = { generateInvoice };