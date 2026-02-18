import OrderModal from "./Order.Modal.js";
import axios from "axios";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      Products,
      BuyerName,
      BuyerPhone,
      BuyerEmail,
      BuyerAddress,
      PaymentMethod,
      TotalAmount,
      TransactionId,
    } = req.body;

    const newOrder = new OrderModal({
      Products,
      BuyerName,
      BuyerPhone,
      BuyerEmail,
      BuyerAddress,
      PaymentMethod,
      TotalAmount,
      TransactionId,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModal.find()
      .populate("Products.ProductId", "ProductCode ProductImgUrl ProductPrice") // populate only needed fields
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModal.findById(req.params.id).populate(
      "Products.ProductId",
      "ProductCode ProductImgUrl ProductPrice",
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { OrderStatus, PaymentStatus } = req.body;

    const order = await OrderModal.findByIdAndUpdate(
      req.params.id,
      { OrderStatus, PaymentStatus },
      { new: true },
    );

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModal.findByIdAndDelete(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const WHATSAPP_TOKEN = "";
const PHONE_NUMBER_ID = "";

const OrderObj = {
  Products: [
    { name: "kcuh name One", quantity: 3, price: 300 },
    {
      name: "kcuh name Two",
      quantity: 2,
      price: 500,
    },
  ],
  BuyerPhone: "923437117831",
  TotalAmount: 800,
  PaymentMethod: "COD",
};

async function sendWhatsAppOrder(order) {
  try {
    const productText = order.Products.map(p =>
      `• ${p.name}\nQty: ${p.quantity}\nPrice: $${p.price}`
    ).join("\n\n");

    const res = await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: order.BuyerPhone, // format: 923001234567 (no +)
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text:
              `Order Details\n\n${productText}\n\nTotal: $${order.TotalAmount}\nPayment: ${order.PaymentMethod}\n\nConfirm order?`
          },
          action: {
            buttons: [
              { type: "reply", reply: { id: "confirm", title: "Confirm" } },
              { type: "reply", reply: { id: "cancel", title: "Cancel" } }
            ]
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}
// const resPonse = await sendWhatsAppOrder(OrderObj);
// console.log(resPonse);
