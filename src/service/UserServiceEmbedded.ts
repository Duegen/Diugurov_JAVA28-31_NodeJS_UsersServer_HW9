import {UserService} from "./UserService.js";
import {User} from "../model/user.js";
import {UserPersistanceFileService} from "./UserPersistanceFileService.js";
import fs from "fs";
import {dataBaseDir} from "../config/appConfig.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class UserServiceEmbedded implements UserService, UserPersistanceFileService {
    private users: User[] = [];

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
        const result = this.users.find(u => u.userId == user.userId)

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

    checkUser(user: User): boolean{
        if(('userId' in user) && ('userName' in user) && Object.keys(user).length < 3){
            return !!(user.userName && !Number.isNaN(user.userId) && Number(user.userId) > 0);
        }else
            return false;
    }

    restoreDataFromFile(): Promise<string> {

        return new Promise((resolve, reject) => {
            const filePath = dataBaseDir + 'data.txt'

            const readStream = fs.createReadStream(filePath, {highWaterMark: 32});
            let result = "";
            readStream.on('data', chunk => {
                if (chunk) {
                    result += chunk.toString();
                } else
                    result = "[]";
            })
            readStream.on('end', () => {
                try {
                    if (result) {
                        const tmpUsers = [...JSON.parse(result)];
                        let integrityFlag = true;
                        tmpUsers.forEach((user) => {
                            if(this.checkUser(user))
                                this.users.push(user);
                            else integrityFlag = false;
                        })
                        const tmpKeys = this.users.map(user => user.userId)
                        this.users = this.users.filter((user, index) => {
                            if(!(tmpKeys.indexOf(user.userId) !== index))
                                return true;
                            else{integrityFlag = false; return false;}
                        })
                        if(integrityFlag)
                            resolve("data was restored from file");
                        else
                            resolve("database integrity issue, data was restored partially")
                    }
                } catch (e) {
                    this.users = [{userId: 7, userName: "Bond"}];
                    reject("error parsing database file, default users array");
                }

            })
            readStream.on('error', (err) => {
                this.users = [{userId: 7, userName: "Bond"}];
                reject("database file not found, default users array");
            })
        })
    }

    saveDataToFile(): Promise<string> {
        return new Promise((resolve, reject) => {

            fs.mkdir(dataBaseDir, (err) => {
                if (err && err.code !== 'EEXIST')
                    reject("database directory not created")
                else {
                    const filePath = dataBaseDir + 'data.txt'
                    const writeStream = fs.createWriteStream(filePath,
                        {encoding: "utf-8", flags: "w"})
                    const data = JSON.stringify(this.users)
                    writeStream.write(data);
                    writeStream.end();

                    writeStream.on("finish", () => {
                        writeStream.close();
                        resolve("database successfully saved to file");
                    })
                    writeStream.on('error', (err) => {
                        reject("database not saved to file");
                    })
                }
            })
        })

    }

}

export const userServiceEmbedded = new UserServiceEmbedded();