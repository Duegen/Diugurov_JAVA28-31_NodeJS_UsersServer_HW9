import {NextFunction, Response} from "express";
import {myLogger} from "./logger.js";
import {loggedRequest} from "../server.js";


export function loggerMW(req: loggedRequest, res: Response, nextToRouter: NextFunction) {

    if(!req.message || req.message === undefined) {
        delete  req.message;
        nextToRouter()
    }else {
        const [message, type] = req.message!.split('@')
        if(req.flagLog) {
            myLogger.logfileExist() ? myLogger.saveToFile(message, type)
                : myLogger.save(message, type)
        }else
            myLogger.log(message, type);
    }
}