import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    ProductId: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  }
],

    BuyerName: { type: String, required: true },
    BuyerPhone: { type: String, required: true },
    BuyerEmail: { type: String },
    BuyerAddress: { type: String, required: true },

    PaymentMethod: {
      type: String,
      enum: ["COD", "Easypaisa"],
      default: "COD",
    },

    PaymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    OrderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    TransactionId: { type: String },

    TotalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderModal = mongoose.model("Order", OrderSchema);

export default OrderModal;
