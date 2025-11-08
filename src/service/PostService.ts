import {Post} from "../model/post.js";

export interface PostService{
    getAllPosts(): Post[] | null;
    getPostById(postId: Number): Post
    getPostsByUserName(userName: string): Post[]
    addPost(post:Post):boolean;
    removePost(postId: Number): Post;
    setDefaultDatabase(): void;
    getDatabase(): Post[];
    setDatabase(database: Post[]):void;
}