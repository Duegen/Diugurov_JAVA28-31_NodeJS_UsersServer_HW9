import {NextFunction, Response} from "express";
import {HttpError} from "./HttpError.js";
import {api, apiPost, apiUser} from "../config/appConfig.js";
import {loggedRequest} from "../server.js";

export const errorHandler = (err: Error | string, req: loggedRequest, res: Response, next: NextFunction) => {
    if(req.message) {
        next()
        return;
    }
    req.flagLog = false;
    if(err instanceof SyntaxError && 'body' in err) {
        req.message = "invalid JSON in POST request";
        if(req.url.startsWith(api + apiUser))
            req.source = 'addUser'
        else if (req.url.startsWith(api + apiPost))
            req.source = 'postUser'
        res.status(400).send(req.message + '@' + req.source)
        next()
    }

    if(err instanceof HttpError) {
        res.status(err.status).send(err.message + '@' + err.source);
        req.message = err.message;
        req.source = err.source;
    }
    else if(err instanceof Error) {
        res.status(400).send('incorrect request ' + err.message)
        req.message = 'incorrect request ' + err.message;
        req.source = 'unknown';
    }
    else {
        res.status(500).send("unknown server error " + err)
        req.message = "unknown server error " + err
        req.source = 'unknown';
    }
    next();
}