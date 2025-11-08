import {Post} from "../model/post.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {userServiceEmbedded} from "./UserServiceEmbedded.js";

export class PostServiceEmbedded {
    private postsDefault: Post[] = [
        {postId: 1, userId: 7, title: "Post 1", text: "Smth about theme Post 1"},
        {postId: 2, userId: 7, title: "Post 2", text: "Smth about theme Post 2"},
        {postId: 3, userId: 7, title: "Post 3", text: "Smth about theme Post 3"},
        {postId: 4, userId: 1, title: "Post 1", text: "Smth about theme Post 1"},
        {postId: 5, userId: 1, title: "Post 2", text: "Smth about theme Post 2"},
    ];
    private posts: Post[] = [];

    setDefaultDatabase(){
        this.posts = [...this.postsDefault];
    }

    getDatabase(): Post[] {
        return [...this.posts];
    }

    setDatabase(database: Post[]){
        this.posts = [...database];
    }

    getAllPosts(){
        if(this.posts.length)
            return [...this.posts];
        else
            return null;
    };

    getPostById(postId:Number){
        const result = this.posts.find(item => item.postId === postId);
        if (result)
            return result
        else
            throw new HttpError(400,`post with postId ${postId} not found`, 'getPostById');
    };

    getPostsByUserName(userName: string){
        const usersResult = userServiceEmbedded.getUsersByName(userName)
        let postsResult: Post[] = [];

        if(usersResult.length) {
            usersResult.forEach(user => {
                postsResult = postsResult.concat(this.posts.filter(post => post.userId === user.userId))
            })
            return postsResult;
        }
        else
            throw new HttpError(400,`users with userName '${userName}' not found`, 'getPostsByUserName');
    };

    addPost(post:Post) {
        userServiceEmbedded.getUserById(post.userId)

        const result = this.posts.find(p => p.postId === post.postId)
        if (result)
            throw new HttpError(400, `post with postId ${post.postId} is already exists`, 'addPost')
        else {
            this.posts.push(post);
            return true
        }
    };

    removePost(postId:Number) {
        const index = this.posts.findIndex(post => post.postId === postId);
        if(index === -1)
            throw new HttpError(400, `post with postId ${postId} not found`, 'removePost')
        else
            return this.posts.splice(index, 1)[0];
    };

}

export const postServiceEmbedded = new PostServiceEmbedded();