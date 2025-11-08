import {NextFunction, Response} from "express";
import {myLogger} from "./logger.js";
import {loggedRequest} from "../server.js";

export function loggerMW(req: loggedRequest, res: Response, next: NextFunction) {
    if(req.message) {
        const message = req.message;
        const source = req.source!;
        if (req.flagLog) {
            myLogger.logfileExist() ? myLogger.saveToFile(message, source)
                : myLogger.save(message, source)
        } else
            myLogger.log(message, source);
    }
    next()
}