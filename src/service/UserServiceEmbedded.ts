import {UserService} from "./UserService.js";
import {User} from "../model/user.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class UserServiceEmbedded implements UserService {
    private users: User[] = [];
    private usersDefault: User[] = [
                     {userId: 7, userName: "Bond"},
                     {userId: 1, userName: "John"}
                 ];

    setDefaultDatabase(){
        this.users = [...this.usersDefault];
    }

    getDatabase(): User[] {
        return [...this.users];
    }

    setDatabase(users: User[]){
        this.users = [...users];
    }

    getAllUsers(): User[] | null{
        if (this.users.length)
            return [...this.users];
        else
            return null;
    }

    getUserById(userId: Number):User {
        const result = this.users.find(item => item.userId === userId);
        if (result)
            return result
        else
            throw new HttpError(400,`user with userId ${userId} not found`, 'getUserById');
    }

    addUser(user: User): boolean {
        const result = this.users.find(u => u.userId === user.userId)

        if (result)
            throw new HttpError(400, `user with userId ${user.userId} is already exists`, 'addUser')
        else {
            this.users.push(user);
            return true
        }
    }

    removeUser(userId: Number): User | null {
        const index = this.users.findIndex(user => user.userId === userId);
        if(index === -1)
            throw new HttpError(400, `user with userId ${userId} not found`, 'removeUser')
        else
            return this.users.splice(index, 1)[0];
    }

    updateUser(userId: Number, newName: string): boolean {
        const index = this.users.findIndex(user => user.userId === userId);
        if (index!== -1) {
            this.users[index].userName = newName;
            return true
        } else
            throw  new HttpError(400, `user with userId ${userId} not found`, 'updateUser')
    }

    getUsersByName(userName: string){
        return this.users.filter(user => user.userName === userName)
    }
}

export const userServiceEmbedded = new UserServiceEmbedded();