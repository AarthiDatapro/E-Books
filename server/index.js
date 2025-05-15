import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { mongooseURL, PORT } from "./configs/config.js";
import userRouter from "./routes/userRouter.js";
import usersRouter from "./routes/usersRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { directingUrl } from "./controllers/userController.js";
import affileRouter from "./routes/affileRouter.js";
import affiliateRouter from "./routes/affiliateRoutes.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Backend" });
});
// CORS configuration
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both development ports
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    })
);

// Routes
app.use("/auth", userRouter)
app.use("/user", usersRouter)
app.use("/admin", adminRouter)
app.use("/affiliate", affiliateRouter)

app.get('/r/:key', directingUrl)

// file upload
app.use("/uploads", express.static("uploads"));

mongoose
    .connect(mongooseURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongoose connected successfully");
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.log(`Error in connecting Database : ${err}`);
    });