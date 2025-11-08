import {PostService} from "../service/PostService.js";
import {NextFunction, Response} from "express";
import {postServiceEmbedded} from "../service/PostServiceEmbedded.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {postIdShema, postNameShema, postShema} from "../joiShemas/postShema.js";
import {loggedRequest} from "../server.js";

export class PostController {

    constructor(private postService: PostService) {

    }

    getAllPosts(req: loggedRequest, res: Response, next: NextFunction) {
        const result = this.postService.getAllPosts();
        req.source = 'getAllPosts';
        if (result) {
            res.status(200).send(result)
            req.message = "all posts are responsed";
            req.flagLog = true;
        } else {
            res.status(200).send('post list is empty@getAllPosts');
            req.message = "post list is empty";
            req.flagLog = false;
        }
        next()
    }

    getPostById(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = postIdShema.validate(req.query);
        if (error) throw new HttpError(400, error.message, 'getPostById')

        const result = this.postService.getPostById(+req.query.postId!);
        if (result) {
            res.status(200).send(result);
            req.message = `post with postId ${req.query.postId} is responsed`;
            req.source = 'getPostById';
            req.flagLog = true;
        }
        next()
    }

    getPostsByUserName(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = postNameShema.validate(req.params);
        if (error) throw new HttpError(400, error.message, 'getPostsByUserName')

        const result = this.postService.getPostsByUserName(req.params.userName)
        if (result) {
            res.status(200).send(result);
            req.message = `posts of users with name '${req.params.userName}' are responsed`;
            req.source = 'getPostsByUserName';
            req.flagLog = true;
        }
        next()
    }

    addPost(req: loggedRequest, res: Response, next: NextFunction) {
        const body = req.body;
        const {error} = postShema.validate(body);
        if (error) throw new HttpError(400, error.message, 'addPost')

        const result = this.postService.addPost(req.body);
        if (result) {
            res.status(200).send(result);
            req.message = `post with postId ${body.postId} is successfully added`
            req.source = 'addPost';
            req.flagLog = true;
        }
        next()
    }

    removePost(req: loggedRequest, res: Response, next: NextFunction) {
        const {error} = postIdShema.validate(req.query);
        if (error) throw new HttpError(400, error.message, 'removePost')

        const result = this.postService.removePost(+req.query.postId!);
        if (result) {
            res.status(200).send(result);
            req.message = `post with postId ${req.query.postId} is removed`
            req.source = 'removePost';
            req.flagLog = true;
        }
        next()
    }
}

export const postControllerEmbedded = new PostController(postServiceEmbedded)