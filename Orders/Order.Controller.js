import OrderModal from "./Order.Modal.js";

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
      ProductId: Products,
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
export const getAllOrders =   async (req, res) => {
  try {
    const orders = await OrderModal.find()
      .populate("ProductId", "ProductCode ProductImgUrl ProductPrice") // populate only needed fields
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};


// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModal.findById(req.params.id).populate("ProductId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

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
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModal.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
