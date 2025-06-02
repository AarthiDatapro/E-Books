import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: {
    type: Object, // Use ObjectId and reference a product model if needed
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
    enum: ["Full Cart Checkout", "Buy Single Item"],
    required: true,
  },
  referal: {
    type: String,
    default: "hero",
  },
  userEmail: {
    type: String,
    required: true
  },
  paidAt: {
    type: Date,
    default: Date.now,
  }
});

const orderModel = mongoose.model("orders", orderSchema);

export default orderModel;
