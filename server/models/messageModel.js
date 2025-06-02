import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  referal: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true
  },
}, { timestamps: true });

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
