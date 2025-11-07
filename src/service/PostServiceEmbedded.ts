import {Post} from "../model/post.js";

export class PostServiceEmbedded {
    private posts: Post[] = [];

    getAllPosts(){
        return this.posts;
    };

    getPostById(postId:Number){
        return {postId:1, userId: 1, title:'Post 1', text: "ghj"};
    };

    getPostsByUserName(userName: string){
        return this.posts;
    };

    addPost(post:Post) {
        return true;
    };

    removePost(postId:Number) {
        return {postId:1,userId: 1, title:'Post 1', text: "ghj"};
    };
}

export const postServiceEmbedded = new PostServiceEmbedded();