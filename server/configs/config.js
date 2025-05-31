import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const mongooseURL = process.env.MONGODB_URI;

// Razorpay configuration
export const razorpayKey = process.env.RAZORPAY_KEY;
export const razorpaySecretKey = process.env.RAZORPAY_SECRET_KEY;
export const linkingUrl = process.env.LINKING_URL;



//security keys
export const SecretKey = process.env.AUTH_SECRET_KEY;
export const RefreshToken = process.env.REFRESH_TOKEN;

// Email configuration
export const gmailUser = process.env.GMAIL_USER;
export const gmailPass = process.env.GMAIL_PASS;
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
});