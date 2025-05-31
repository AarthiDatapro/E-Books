import express from "express";
import upload from "../configs/fileConfig.js";
import { getMyProducts, productUpload, editProduct, deleteProduct, getSalesAnalytics, getAffiliators, deleteAffiliator, updateAffiliator, resetCommissions, resetRestriction, findReferral } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post(
  "/addProduct",
  upload.fields([
    { name: "bookImage", maxCount: 1 },
    { name: "bookPdf", maxCount: 1 },
  ]),
  productUpload
);

adminRouter.get("/getProducts", getMyProducts);
adminRouter.put("/editProduct", editProduct);
adminRouter.delete("/deleteProduct/:id", deleteProduct);
adminRouter.get("/sales-analytics", getSalesAnalytics);
adminRouter.get("/getAffiles", getAffiliators);
adminRouter.delete("/deleteAffiliator/:email", deleteAffiliator);
adminRouter.put("/updateAffiliator/:id", updateAffiliator);
adminRouter.post("/updateAffiliator/reset", resetCommissions);
adminRouter.post("/toggleRestriction", resetRestriction);
adminRouter.post("/findReferral", findReferral);

export default adminRouter;