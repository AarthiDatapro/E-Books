import path from "path";
import { gmailUser, transporter } from "../configs/config.js";
import messageModel from "../models/messageModel.js";
import orderModel from "../models/ordersModel.js";
import productModel from "../models/productModel.js";


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
      product: product,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      orderType: description,
      referal: referal
    })

    const message = await messageModel.create({
      text: "Order Placed",
      orderId: razorpay_order_id,
      bookName: product.bookName,
      price: product.total_price,
      referal: referal
    })

    if (item && order && message) {
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

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.json({ status: false, msg: "Error in sending mail" });
        }
        return res.json({
          status: true,
          msg: "Product purchased successfully",
        });
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
      msg: "Error purchasing product",
    });
  }
};

export const buyAll = async (req, res) => {
  try {
    const { cart, razorpay_payment_id, razorpay_order_id, razorpay_signature, description, referal, email } = req.body;

    for (let i = 0; i < cart.length; i++) {
      await orderModel.create({
        product: cart[i],
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        orderType: description,
        referal: referal
      });

      await messageModel.create({
        text: "Order Placed",
        orderId: razorpay_order_id,
        bookName: cart[i].bookName,
        price: cart[i].total_price,
        referal: referal
      })

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

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.json({ status: false, msg: "Error in sending mail" });
        }
        return res.json({
          status: true,
          msg: "Product purchased successfully",
        });
      });
    }

    return res.json({
      status: true,
      msg: "Products purchased successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: "Error purchasing products",
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

