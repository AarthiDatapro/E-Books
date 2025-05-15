import express from "express";
import { createOrder, getMessages, userLogin, userSignup } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.post("/payments/create-order", createOrder);
userRouter.post("/getMessages", getMessages)

export default userRouter;