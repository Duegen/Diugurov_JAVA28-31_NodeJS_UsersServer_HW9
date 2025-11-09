import express from "express";
import {logController} from "../controllers/LoggerController.js";
import {Request, Response} from "express";

export const loggerRouter = express.Router();

loggerRouter.get("/", (req: Request, res: Response, next) => {
    if(Object.keys(req.query).length)
        logController.getLogByType(req, res, next);
    else
        logController.getLog(req, res, next)
})