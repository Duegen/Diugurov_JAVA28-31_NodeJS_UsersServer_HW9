import {myLogger} from "../utiles/logger.js";
import {logShema} from "../joiShemas/logShema.js";
import {NextFunction, Response} from "express";
import {loggedRequest} from "../server.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class LoggerController{
    getLog(req: loggedRequest, res: Response, next: NextFunction) {
        const allLogs = myLogger.getLogArray()
        res.status(200).send(allLogs);
        req.message = 'log array is responsed';
        req.source = 'getLog'
        req.flagLog = true;
        next()
    }

    getLogByType(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = logShema.validate(req.query)

        if(error) throw new HttpError(400,error.message,'getLogByType');
        else{
            const type = req.query.type;
            const typeLogs = myLogger.getLogArray().filter((log) => log.type === type);
            if(typeLogs.length) {
                res.status(200).send(typeLogs);
                req.message = `log's with type '${type}' are responsed`;
                req.source = 'getLogByType'
                req.flagLog = true;
            }
            else{
                res.status(200).send(`log's with type '${type}' not found`);
                req.message = `log's with type '${type}' not found`;
                req.source = 'getLogByType'
                req.flagLog = false;
            }
            next()
        }
    }
}

export const logController = new LoggerController()