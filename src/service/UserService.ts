import {User} from "../model/user.js";

export interface UserService{
    addUser(user:User):boolean;
    removeUser(userId:Number):User | null;
    getAllUsers(): User[] | null;
    getUserById(userId: Number): User;
    updateUser(userId:Number, newName:string): boolean;
    getUsersByName(userName:string): User[];
    setDefaultDatabase(): void;
    getDatabase(): User[];
    setDatabase(users: User[]): void;
}