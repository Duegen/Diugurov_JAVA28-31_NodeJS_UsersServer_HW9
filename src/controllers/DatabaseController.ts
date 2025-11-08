import {DatabaseService} from "../service/DatabaseService.js";
import {databaseServiceEmbedded} from "../service/DatabaseServiceEmbedded.js";
import {User} from "../model/user.js";
import {userServiceEmbedded} from "../service/UserServiceEmbedded.js";
import {postServiceEmbedded} from "../service/PostServiceEmbedded.js";
import {Post} from "../model/post.js";
import {dataBaseDir} from "../config/appConfig.js";
import {myLogger} from "../utiles/logger.js";
import {userShema} from "../joiShemas/userShema.js";
import {postShema} from "../joiShemas/postShema.js";

export class DatabaseController {

    constructor(private databaseService: DatabaseService) {

    }

    async saveDatabaseToFile(): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const userDatabase: User[] = userServiceEmbedded.getDatabase();
            const postDatabase: Post[] = postServiceEmbedded.getDatabase();
            const filePathUser = dataBaseDir + 'users.txt', filePathPost = dataBaseDir + 'posts.txt';

            await databaseServiceEmbedded.saveDatabaseToFile(filePathUser, userDatabase).then(message => {
                myLogger.logfileExist() ? myLogger.saveToFile('users ' + message, 'service')
                    : myLogger.save('users ' + message, 'service');
                databaseServiceEmbedded.saveDatabaseToFile(filePathPost, postDatabase).then(message => {
                    myLogger.logfileExist() ? myLogger.saveToFile('posts ' + message, 'service')
                        : myLogger.save('posts ' + message, 'service');
                    resolve();
                }).catch(() => {
                    myLogger.logfileExist() ? myLogger.saveToFile('posts ' + message, 'service')
                        : myLogger.save('posts ' + message, 'service');
                    reject();
                })
            }).catch(err => {
                myLogger.logfileExist() ? myLogger.saveToFile('users and posts ' + err, 'service')
                    : myLogger.save('users ' + err, 'service');
                reject();
            })
        })
    }

    async restoreDataFromFile(): Promise<void> {

        return new Promise(async (resolve, reject) => {
            const filePathUser = dataBaseDir + 'users.txt', filePathPost = dataBaseDir + 'posts.txt';
            let userDatabase: User[] = [];
            let postDatabase: Post[] = [];
            let integrityFlag = true;

            await databaseServiceEmbedded.restoreDatabaseFromFile(filePathUser).then(async (database) => {
                database.forEach(user => {
                    const {error} = userShema.validate(user)
                    if (!error) userDatabase.push(user as User)
                    else integrityFlag = false;
                })
                userDatabase = userDatabase.filter((user, index) => {
                    const ui = userDatabase.findIndex(u => u.userId === user.userId)
                    if (index !== ui) integrityFlag = false;
                    return index === ui;
                })
                userServiceEmbedded.setDatabase(userDatabase)
                if (integrityFlag)
                    myLogger.logfileExist() ? myLogger.saveToFile('users database is loaded from file', 'service')
                        : myLogger.save('users database is loaded from file', 'service');
                else
                    myLogger.logfileExist() ? myLogger.saveToFile('users database is loaded partly from file', 'service')
                        : myLogger.save('users database is loaded partly from file', 'service');
                await databaseServiceEmbedded.restoreDatabaseFromFile(filePathPost).then((database) => {
                    integrityFlag = true;
                    database.forEach(post => {
                        const {error} = postShema.validate(post)
                        if (!error) postDatabase.push(post as Post)
                        else integrityFlag = false;
                    })
                    postDatabase = postDatabase.filter((post, index) => {
                        const pi = postDatabase.findIndex(p => p.postId === post.postId)
                        const ui = userDatabase.findIndex(u => post.userId === u.userId)
                        if (index !== pi || ui === -1) {
                            integrityFlag = false;
                            return false;
                        }
                        else return true;
                    })
                    postServiceEmbedded.setDatabase(postDatabase)
                    if (integrityFlag)
                        myLogger.logfileExist() ? myLogger.saveToFile('posts database is loaded from file', 'service')
                            : myLogger.save('posts database is loaded from file', 'service');
                    else
                        myLogger.logfileExist() ? myLogger.saveToFile('posts database is loaded partly from file', 'service')
                            : myLogger.save('posts database is loaded partly from file', 'service');
                    resolve();
                }).catch(() => {
                    postServiceEmbedded.setDefaultDatabase()
                    myLogger.logfileExist() ? myLogger.saveToFile('posts database not loaded from file, default database is implemented', 'service')
                        : myLogger.save('posts database not loaded from file, default database is implemented', 'service');
                    resolve()
                })
            }).catch(() => {

                reject();
            })
        })
    }
}

export const databaseControllerEmbedded = new DatabaseController(databaseServiceEmbedded)