import {NextFunction, Request, Response} from "express";

function checkId(userId: number): boolean {
    return !(Number.isNaN(userId) || userId <= 0);
}

function checkName(userName: string): boolean {
    return !!userName;
}

export function reqValidation(req: Request, res: Response, errHandler: NextFunction) {
    let message = "";
    switch (req.path) {
        case "/api/users": {
            switch (req.method) {
                case 'GET': {
                    if (!Object.keys(req.query).length) break;
                    if (req.query.userId) {
                        if (!checkId(+req.query.userId))
                            message = "userId is incorrect@GetUserById";
                    } else
                        message = `userId not found in request@GetUserById`;
                    break;
                }
                case 'POST': {
                    if (req.body.userId !== undefined && req.body.userName !== undefined) {
                        if (!checkId(+req.body.userId) || !checkName(req.body.userName))
                            message = `userId or userName is incorrect@addUser`;
                    } else
                        message = `userId or userName not found in request@addUser`;
                    break;
                }
                case 'DELETE': {
                    if (req.query.userId) {
                        if (!checkId(+req.query.userId))
                            message = "userId is incorrect@removeUser";
                    } else
                        message = `userId not found in request@removeUser`;
                    break;
                }
                case 'PATCH': {
                    if (req.query.userId && req.query.newName) {
                        if (!checkId(+req.query.userId) || !checkName(req.query.newName as string))
                            message = "userId or newName is incorrect@updateUser";
                    } else
                        message = `userId or newName not found in request@updateUser`;
                    break;
                }
                default: {

                }
            }
            break;
        }
        default: {

        }
    }
    if (message) errHandler(new Error(message));
    else errHandler("");
}
