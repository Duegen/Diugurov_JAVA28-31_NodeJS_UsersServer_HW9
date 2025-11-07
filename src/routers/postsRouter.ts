import express from "express";
import {postControllerEmbedded as controller} from "../controllers/PostController.js";

export const postsRouter = express.Router();

postsRouter.get("/", (req, res) => {
    if(Object.keys(req.query).length)
        controller.getPostById(req, res);
    else
        controller.getAllPosts(req, res);
})

postsRouter.get("/user", (req, res) => {
    controller.getPostsByUserName(req, res);
})

postsRouter.post("/", (req, res) => {
    controller.addPost(req, res);
})

postsRouter.delete("/",  (req, res) => {
    controller.removePost(req, res);
})