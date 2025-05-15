import express from "express";
import { getAllProducts, getProductDetails} from "../controllers/usersController.js";
import { buyNow } from "../controllers/usersController.js";
import { buyAll } from "../controllers/usersController.js";
const usersRouter = express.Router();

usersRouter.get("/getAllProducts", getAllProducts);
usersRouter.post("/buyNow", buyNow);    
usersRouter.post("/buyAll", buyAll);
usersRouter.post("/getProductDetails", getProductDetails)


export default usersRouter;
