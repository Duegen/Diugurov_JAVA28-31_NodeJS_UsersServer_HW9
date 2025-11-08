import express from "express";
import {userControllerEmbedded as controller} from "../controllers/UserController.js";

export const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
    if(Object.keys(req.query).length)
        controller.getUserById(req, res)
    else
        controller.getAllUsers(req, res);
})

usersRouter.post("/", (req, res) => {
    controller.addUser(req, res);
})

usersRouter.delete("/", (req, res) => {
    controller.removeUser(req, res);
})

usersRouter.patch("/", (req, res) => {
    controller.updateUser(req, res);
})