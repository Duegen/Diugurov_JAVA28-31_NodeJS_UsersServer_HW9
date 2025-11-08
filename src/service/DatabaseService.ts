import {Post} from "../model/post.js";
import {User} from "../model/user.js";

export interface DatabaseService {
    saveDatabaseToFile(filePath:string, database: Post[] | User[]): Promise<string>
}