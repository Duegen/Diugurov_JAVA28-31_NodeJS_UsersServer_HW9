import express from "express";
import {logController} from "../controllers/LoggerController.js";

export const loggerRouter = express.Router();

loggerRouter.get("/", (req, res) => {
    logController.getLog(req, res)
})