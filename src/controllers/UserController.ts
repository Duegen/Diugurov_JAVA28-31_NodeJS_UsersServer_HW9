import {UserService} from "../service/UserService.js";
import {userServiceEmbedded} from "../service/UserServiceEmbedded.js";
import {NextFunction, Response} from "express";
import {HttpError} from "../errorHandler/HttpError.js";
import {userShema, userIdNewnameShema, userIdShema} from "../joiShemas/userShema.js";
import {loggedRequest} from "../server.js";

export class UserController {

    constructor(private userService: UserService) {

    }

    getAllUsers(req: loggedRequest, res: Response, next: NextFunction) {
        const result = this.userService.getAllUsers();
        req.source = 'getAllUsers';
        if(result) {
            res.status(200).send(result)
            req.message = "all users are responsed";
            req.flagLog = true;
        }
        else {
            res.status(200).send('user list is empty@getAllUsers');
            req.message = "user list is empty";
            req.flagLog = false;
        }
        next()
    }

    addUser(req: loggedRequest, res: Response, next: NextFunction) {
        const body = req.body;
        const {error} = userShema.validate(body);
        if(error) throw new HttpError(400, error.message, 'addUser')

        const result = this.userService.addUser(req.body);
        if (result){
            res.status(200).send(result);
            req.message = `user with userId ${body.userId} is successfully added`;
            req.source = 'addUser';
            req.flagLog = true;
        }
        next()
    }

    getUserById(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = userIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'getUserById')

        const result = this.userService.getUserById(+req.query.userId!);
        if (result){
            res.status(200).send(result);
            req.message = `user with userId ${req.query.userId} is rersponsed`
            req.source = 'getUserById';
            req.flagLog = true;
        }
        next()
    }

    removeUser(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = userIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'removeUser')

        const result = this.userService.removeUser(+req.query.userId!);
        if (result){
            res.status(200).send(result);
            req.message = `user with userId ${req.query.userId} is removed`;
            req.source = 'removeUser';
            req.flagLog = true;
        }
        next()
    }

    updateUser(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = userIdNewnameShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'updateUser')

        const result = this.userService.updateUser(+req.query.userId!, req.query.newName as string);
        if (result){
            res.status(200).send(result);
            req.message = `user with userId ${req.query.userId} is updated`
            req.source = 'updateUser';
            req.flagLog = true;
        }
        next()
    }
}

export const userControllerEmbedded = new UserController(userServiceEmbedded);
