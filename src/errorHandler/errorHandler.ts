import {NextFunction, Response} from "express";
import {loggedRequest} from "../server.js";
import {HttpError} from "./HttpError.js";
import {api, apiPost, apiUser} from "../config/appConfig.js";

export const errorHandler = (err: Error, req: loggedRequest, res: Response, next: NextFunction) => {
    if(err instanceof SyntaxError && 'body' in err) {
        if(req.path === api + apiUser) res.status(400).send("invalid JSON in POST request" + '@' + 'addUser')
        else if (req.path === api + apiPost)
            res.status(400).send("invalid JSON in POST request" + '@' + 'addPost')
        return;
    }

    if(err instanceof HttpError)
        res.status(err.status).send(err.message + '@' + err.source)
    else if(err instanceof Error)
        res.status(400).send('uncorrect request ' + err.message)
    else res.status(500).send("Unknown server error " + err)
    next();
}