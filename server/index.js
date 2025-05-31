import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { mongooseURL, PORT, SecretKey } from "./configs/config.js";
import userRouter from "./routes/userRouter.js";
import usersRouter from "./routes/usersRouter.js";
import adminRouter from "./routes/adminRouter.js";
import affiliateRouter from "./routes/affiliateRoutes.js";

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://mahicommunity-zv6ks.ondigitalocean.app",
      "https://mahicommunity.com",
      "https://mahicommunity.com/userHome"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "api-key"],
  })
);



export const apiKeyAuth = (req, res, next) => {
  const clientKey = req.headers["api-key"];
  const serverKey =  SecretKey;

  if (clientKey && clientKey === serverKey) {
    next(); // Valid request
  } else {
    res.sendStatus(403); // Forbidden
  }
};



app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Mahicommunity Backend",
    status: "Running",
  });
});



// Routes
app.use("/auth", apiKeyAuth, userRouter);
app.use("/user",apiKeyAuth, usersRouter);
app.use("/admin", apiKeyAuth, adminRouter);
app.use("/affiliate",apiKeyAuth, affiliateRouter);


// Serve uploaded files
app.use("/uploads", express.static("uploads"));


// Welcome API
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to Backend" });
});


// MongoDB connection and start server
mongoose
  .connect(mongooseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
