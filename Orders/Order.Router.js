import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "./Order.Controller.js";

const router = express.Router();

// Routes
router.post("/create", createOrder);        // ✅ create new order
router.get("/", getAllOrders);              // ✅ get all orders
router.get("/:id", getOrderById);           // ✅ get single order
router.put("/:id", updateOrderStatus);      // ✅ update status
router.delete("/:id", deleteOrder);         // ✅ delete order

export default router;
