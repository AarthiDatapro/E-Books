import userModel from "../models/userModel.js";
import shortUrlModel from "../models/shortUrlModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createRequire } from 'module';
import messageModel from "../models/messageModel.js";
import { gmailUser, linkingUrl, razorpayKey, razorpaySecretKey, transporter } from "../configs/config.js";
const require = createRequire(import.meta.url);
const Razorpay = require("razorpay");

// --------------------- Generate short key ----------------------
const generateShortKey = () => {
    return crypto.randomBytes(6).toString('base64url');
};

// --------------------- Store short URL in MongoDB ----------------------
const storeUrl = async (originalUrl, email) => {
    const shortKey = generateShortKey();

    await shortUrlModel.create({
        shortKey,
        originalUrl,
        email
    });

    return shortKey;
};



// --------------------- User Signup ----------------------
const userSignup = async (req, res, next) => {
    try {
        const userData = {
            role: req.body.role,
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            city: req.body.city,
            state: req.body.state,
            password: req.body.password,
        };

        const phoneNumberCheck = await userModel.findOne({ phoneNumber: userData.phoneNumber });
        if (phoneNumberCheck) return res.json({ status: false, msg: "Phone Number already exists" });

        const emailCheck = await userModel.findOne({ email: userData.email });
        if (emailCheck) return res.json({ status: false, msg: "Email already exists" });

        const originalUrl = linkingUrl; // Update for production
        const shortKey = await storeUrl(originalUrl, userData.email);
        const shortUrl = `http://${req.headers.host}/r/${shortKey}`;

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await userModel.create({
            ...userData,
            password: hashedPassword,
            shortUrl
        });



        const mailOptions = {
            from: gmailUser,
            to: userData.email,
            bcc: gmailUser,
            subject: "Confirmation - Affiliator Registration",
            text: `hello ${userData.username},\n\nThank you for registering as an Affiliator! Here is your marketing details:\n\n allocated referal link: ${shortUrl}\n Referal Key: ${shortKey} \n Password: ${userData.password}\n We request you not to share your credentials and enjoy your carefull marketing!\n\nBest regards,\nE- Books Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ status: false, msg: "Error in sending mail" });
            }
            return res.json({
                status: true,
                url: shortUrl,
                msg: "Registered Affiliator successfully!",
                user: user,
            });
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.json({ status: false, msg: "Failed to SignUp! try again." });
        next(err);
    }
};

// --------------------- Redirect URL Handler ----------------------
export const directingUrl = async (req, res) => {
    try {
        const { key } = req.params;
        const record = await shortUrlModel.findOne({ shortKey: key });

        if (record) {
            const redirectUrlWithRef = `${record.originalUrl}?ref=${key}`;
            return res.redirect(redirectUrlWithRef);
        } else {
            return res.status(404).send("Short link not found");
        }
    } catch (err) {
        console.error("Redirect error:", err);
        res.status(500).send("Server error");
    }
};

// --------------------- User Login ----------------------
const userLogin = async (req, res, next) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        };

        const emailCheck = await userModel.findOne({
            email: userData.email,
            role: userData.role,
        });

        if (emailCheck) {
            const passwordCheck = await bcrypt.compare(userData.password, emailCheck.password);
            if (!passwordCheck) return res.json({ status: false, msg: "Password Incorrect!" });

            return res.json({ status: true, user: emailCheck });
        }

        return res.json({ status: false, msg: "Email Incorrect!" });
    } catch (err) {
        console.error("Login error:", err);
        res.json({ status: false, msg: "Failed to Login" });
        next(err);
    }
};

// --------------------- Razorpay Payment ----------------------
const razorpay = new Razorpay({
    key_id: razorpayKey,
    key_secret: razorpaySecretKey,
});

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        });

        res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to create Razorpay order" });
    }
};



export const getMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({}).sort({ createdAt: -1 });
        res.json({ status: true, messages: messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: "Failed to fetch messages" });
    }
};

export { userSignup, userLogin };
