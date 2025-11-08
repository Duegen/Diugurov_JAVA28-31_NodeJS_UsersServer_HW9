import {PostService} from "../service/PostService.js";
import {Request, Response} from "express";
import {postServiceEmbedded} from "../service/PostServiceEmbedded.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {postIdShema, postNameShema, postShema} from "../joiShemas/postShema.js";
import {myLogger} from "../utiles/logger.js";

export class PostController {

    constructor(private postService: PostService) {

    }

    getAllPosts(req: Request, res: Response){
        const result = this.postService.getAllPosts();
        if(result){
            res.status(200).send(result)
            myLogger.logfileExist() ? myLogger.saveToFile("all posts are responsed",'getAllPosts')
                : myLogger.save("all posts are responsed",'getAllPosts')
        }
        else{
            res.status(200).send('post list is empty@getAllPosts');
            myLogger.log("post list is empty",'getAllPosts')
        }
    }

    getPostById(req: Request, res: Response){
        const {error} = postIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'getPostById')

        const result = this.postService.getPostById(+req.query.postId!);
        if(result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`post with postId ${req.query.postId} is responsed`,'getPostById')
                : myLogger.save(`post with postId ${req.query.postId} is responsed`,'getPostById')
        }
    }

    getPostsByUserName(req: Request, res: Response){
        const {error} = postNameShema.validate(req.params);
        if(error) throw new HttpError(400, error.message, 'getPostsByUserName')

        const result = this.postService.getPostsByUserName(req.params.userName)
        if(result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`posts of users with name '${req.params.userName}' are responsed`,'getPostsByUserName')
                : myLogger.save(`posts of users with name '${req.params.userName}' are responsed`,'getPostsByUserName')
        }
    }

    addPost(req: Request, res: Response){
        const body = req.body;
        const {error} = postShema.validate(body);
        if(error) throw new HttpError(400, error.message, 'addPost')

        const result = this.postService.addPost(req.body);
        if (result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`post with postId ${req.query.postId} is successfully added`,'addPost')
                : myLogger.save(`post with postId ${req.query.postId} is successfully added`,'addPost')
        }
    }

    removePost(req: Request, res:Response){
        const {error} = postIdShema.validate(req.query);
        if(error) throw new HttpError(400, error.message, 'removePost')

        const result = this.postService.removePost(+req.query.postId!);
        if (result){
            res.status(200).send(result);
            myLogger.logfileExist() ? myLogger.saveToFile(`post with postId ${req.query.postId} is removed`,'removePost')
                : myLogger.save(`post with postId ${req.query.postId} is removed`,'removePost')
        }
    }
}

export const postControllerEmbedded = new PostController(postServiceEmbedded)