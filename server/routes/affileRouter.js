import express from "express";
import { affileDetails } from "../controllers/affileController.js";

const affileRouter = express.Router();

affileRouter.post("/", affileDetails);
affileRouter.post("/getMessagesByRef", affileDetails);

export default affileRouter;