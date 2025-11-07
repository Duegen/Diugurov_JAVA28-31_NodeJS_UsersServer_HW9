import {IncomingMessage, ServerResponse} from "node:http";
import {myLogger} from "../utiles/logger.js";

export class LoggerController{
    getLog(req: IncomingMessage, res: ServerResponse) {
        myLogger.logfileExist() ? myLogger.saveToFile('log file is responsed', 'getLog')
            : myLogger.save('log file is responsed',  'getLog');
        const allLogs = myLogger.getLogArray()
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(allLogs));
    }
}

export const logController = new LoggerController()