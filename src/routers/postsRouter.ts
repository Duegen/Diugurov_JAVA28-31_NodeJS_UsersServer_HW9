import express from "express";
import {postControllerEmbedded as controller} from "../controllers/PostController.js";

export const postsRouter = express.Router();

postsRouter.get("/", (req, res, next) => {
    if(Object.keys(req.query).length)
        controller.getPostById(req, res, next);
    else
        controller.getAllPosts(req, res, next);
})

postsRouter.get("/user/:userName", (req, res, next) => {
    controller.getPostsByUserName(req, res, next);
})

postsRouter.post("/", (req, res, next) => {
    controller.addPost(req, res, next);
})

postsRouter.delete("/",  (req, res, next) => {
    controller.removePost(req, res, next);
})