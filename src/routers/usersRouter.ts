import express from "express";
import {userControllerEmbedded as controller} from "../controllers/UserController.js";

export const usersRouter = express.Router();

usersRouter.get("/", (req, res, next) => {
    if(Object.keys(req.query).length)
        controller.getUserById(req, res, next)
    else
        controller.getAllUsers(req, res, next);
})

usersRouter.post("/", (req, res, next   ) => {
    controller.addUser(req, res, next);
})

usersRouter.delete("/", (req, res, next) => {
    controller.removeUser(req, res, next);
})

usersRouter.patch("/", (req, res, next) => {
    controller.updateUser(req, res,next);
})