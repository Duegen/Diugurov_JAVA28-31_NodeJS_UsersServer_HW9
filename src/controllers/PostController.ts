import {PostService} from "../service/PostService.js";
import {Request, Response} from "express";
import {PostServiceEmbedded, postServiceEmbedded} from "../service/PostServiceEmbedded.js";

export class PostController {

    constructor(private postService: PostServiceEmbedded) {

    }

    getAllPosts(req: Request, res: Response){

    }

    getPostById(req: Request, post: Response){

    }

    getPostsByUserName(req: Request, res: Response){

    }

    addPost(req: Request, res: Response){

    }

    removePost(req: Request, post:Response){

    }

}

export const postControllerEmbedded = new PostController(postServiceEmbedded)