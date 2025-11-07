import {UserService} from "../service/UserService.js";
import {userServiceEmbedded} from "../service/UserServiceEmbedded.js";
import {NextFunction, Response} from "express";
import {loggedRequest} from "../server.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {userIdNameShema, userIdNewnameShema, userIdShema} from "../joiShemas/userShema.js";

export class UserController {

    constructor(private userService: UserService) {

    }

    getAllUsers(req: loggedRequest, res: Response) {
        const result = this.userService.getAllUsers();
        if(result)
            res.status(200).send(result)
        else
            res.status(200).send('user list is empty@getAllUsers');
    }

    addUser(req: loggedRequest, res: Response) {
        const body = req.body;
        const {error} = userIdNameShema.validate(body);
        if(error) throw new HttpError(400, error.message, 'addUser')

        const result = this.userService.addUser(req.body);
        if (result)
            res.status(200).send(result);
    }

    getUserById(req: loggedRequest, res: Response) {
        const {error} = userIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'getUserById')

        const result = this.userService.getUserById(+req.query.userId!);
        if (result)
            res.status(200).send(result);
    }

    removeUser(req: loggedRequest, res: Response) {
        const {error} = userIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'removeUser')

        const result = this.userService.removeUser(+req.query.userId!);
        if (result)
            res.status(200).send(result);
    }

    updateUser(req: loggedRequest, res: Response) {
        const {error} = userIdNewnameShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'updateUser')

        const result = this.userService.updateUser(+req.query.userId!, req.query.newName as string);
        if (result)
            res.status(200).send(result);
    }
}

export const userControllerEmbedded = new UserController(userServiceEmbedded)
