import {NextFunction, Request, Response} from "express";
import {HttpError} from "./HttpError.js";
import {api, apiPost, apiUser} from "../config/appConfig.js";
import {myLogger} from "../utiles/logger.js";

export const errorHandler = (err: Error | string, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof SyntaxError && 'body' in err) {
        if(req.path === api + apiUser) {
            res.status(400).send("invalid JSON in POST request" + '@' + 'addUser')
            myLogger.log("invalid JSON in POST request", 'addUser')
        }
        else if (req.path === api + apiPost) {
            res.status(400).send("invalid JSON in POST request" + '@' + 'addPost')
            myLogger.log("invalid JSON in POST request", 'addPost')
        }
        next()
        return;
    }

    if(err instanceof HttpError) {
        res.status(err.status).send(err.message + '@' + err.source);
        myLogger.log(err.message, err.source)
    }
    else if(err instanceof Error) {
        res.status(400).send('incorrect request ' + err.message)
        myLogger.log('incorrect request ' + err.message, 'unknown')
    }
    else
        res.status(500).send("Unknown server error " + err)
        myLogger.log("Unknown server error " + err, 'unknown')
    next();
}