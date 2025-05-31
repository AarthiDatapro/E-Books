import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  bookName: { type: String },
  description: { type: String },
  category: { type: String },
  subCategory: { type: String },
  author: { type: String },
  price: { type: Number },
  discPrice: { type: Number },
  bookImage: { type: String },
  bookPdf: { type: String },
  restricted: { type: Boolean, default: false },
}, { timestamps: true });

const productModel = mongoose.model("products", productSchema);

export default productModel;
