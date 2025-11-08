import {UserService} from "../service/UserService.js";
import {userServiceEmbedded} from "../service/UserServiceEmbedded.js";
import {Request, Response} from "express";
import {HttpError} from "../errorHandler/HttpError.js";
import {userShema, userIdNewnameShema, userIdShema} from "../joiShemas/userShema.js";
import {myLogger} from "../utiles/logger.js";

export class UserController {

    constructor(private userService: UserService) {

    }

    getAllUsers(req: Request, res: Response) {
        const result = this.userService.getAllUsers();
        if(result) {
            res.status(200).send(result)
            myLogger.logfileExist() ? myLogger.saveToFile("all users are responsed",'getAllUsers')
                : myLogger.save("all users are responsed",'getAllUsers')
        }
        else {
            res.status(200).send('user list is empty@getAllUsers');
            myLogger.log("user list is empty",'getAllUsers')
        }
    }

    addUser(req: Request, res: Response) {
        const body = req.body;
        const {error} = userShema.validate(body);
        if(error) throw new HttpError(400, error.message, 'addUser')

        const result = this.userService.addUser(req.body);
        if (result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`user with userId ${body.userId} is successfully added`,'addUser')
                : myLogger.save(`user with userId ${body.userId} is successfully added`,'addUser')
        }
    }

    getUserById(req: Request, res: Response) {
        const {error} = userIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'getUserById')

        const result = this.userService.getUserById(+req.query.userId!);
        if (result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`user with userId ${req.query.userId} is rersponsed`,'getUserById')
                : myLogger.save(`user with userId ${req.query.userId} is rersponsed`,'getUserById')
        }
    }

    removeUser(req: Request, res: Response) {
        const {error} = userIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'removeUser')

        const result = this.userService.removeUser(+req.query.userId!);
        if (result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`user with userId ${req.query.userId} is removed`,'removeUser')
                : myLogger.save(`user with userId ${req.query.userId} is removed`,'removeUser')
        }
    }

    updateUser(req: Request, res: Response) {
        const {error} = userIdNewnameShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'updateUser')

        const result = this.userService.updateUser(+req.query.userId!, req.query.newName as string);
        if (result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`user with userId ${req.query.userId} is updated`,'updateUser')
                : myLogger.save(`user with userId ${req.query.userId} is updated`,'updateUser')
        }
    }
}

export const userControllerEmbedded = new UserController(userServiceEmbedded);
