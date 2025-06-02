import path from "path";
import { gmailUser, transporter } from "../configs/config.js";
import messageModel from "../models/messageModel.js";
import orderModel from "../models/ordersModel.js";
import productModel from "../models/productModel.js";
import util from "util";


export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    return res.json({
      status: true,
      msg: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: "Error fetching products",
    });
  }
};

export const buyNow = async (req, res) => {
  try {
    const { product, razorpay_payment_id, razorpay_order_id, razorpay_signature, description, referal, email } = req.body;

    const order = await orderModel.create({
      product,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      orderType: description,
      referal,
      userEmail: email
    });

    const message = await messageModel.create({
      text: "Order Placed",
      orderId: razorpay_order_id,
      bookName: product.bookName,
      price: product.total_price,
      referal,
      userEmail: email,
    });

    if (order && message) {
      const mailOptions = {
        from: gmailUser,
        to: email,
        subject: "Confirmation - Order Placed",
        text: `Your order has been placed successfully.\n\n Book Name: ${product.bookName} \n Price: ${product.total_price} \n\n Thank you for shopping with us!`,
        attachments: [
          {
            filename: product.bookPdf,
            path: path.join(
              process.cwd(),
              "uploads",
              "pdfs",
              product.category,
              product.subCategory,
              product.bookPdf
            ),
            contentType: "application/pdf"
          }
        ]
      };

      // Convert sendMail to a promise-based function
      const sendMailPromise = util.promisify(transporter.sendMail).bind(transporter);
      await sendMailPromise(mailOptions);

      return res.json({
        status: true,
        msg: "Product purchased successfully and email sent.",
      });
    }

    return res.json({
      status: false,
      msg: "Product not found",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: "Error purchasing product or sending email",
    });
  }
};

export const buyAll = async (req, res) => {
  try {
    const { cart, razorpay_payment_id, razorpay_order_id, razorpay_signature, description, referal, email } = req.body;

    const sendMailPromise = util.promisify(transporter.sendMail).bind(transporter);

    for (let i = 0; i < cart.length; i++) {
      await orderModel.create({
        product: cart[i],
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        orderType: description,
        referal,
        userEmail: email,
      });

      await messageModel.create({
        text: "Order Placed",
        orderId: razorpay_order_id,
        bookName: cart[i].bookName,
        price: cart[i].total_price,
        referal,
        userEmail: email,
      });

      const mailOptions = {
        from: gmailUser,
        to: email,
        subject: "Confirmation - Order Placed",
        text: `Your order has been placed successfully.\n\n Book Name: ${cart[i].bookName} \n Price: ${cart[i].total_price} \n\n Thank you for shopping with us!`,
        attachments: [
          {
            filename: cart[i].bookPdf,
            path: path.join(
              process.cwd(),
              "uploads",
              "pdfs",
              cart[i].category,
              cart[i].subCategory,
              cart[i].bookPdf
            ),
            contentType: "application/pdf"
          }
        ]
      };

      await sendMailPromise(mailOptions);
    }

    return res.json({
      status: true,
      msg: "Products purchased successfully and emails sent.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: "Error purchasing products or sending emails",
    });
  }
};


export const getProductDetails = async (req, res) => {
  const productId = req.body.productId;
  const item = await productModel.findById(productId);
  if (item)
    return res.json({ status: true, product: item })
  return res.json({ status: false, msg: "No such Product found!" })
}

