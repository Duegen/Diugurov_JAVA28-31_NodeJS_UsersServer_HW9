import fs from "fs";
import {DatabaseService} from "./DatabaseService.js";
import {Post} from "../model/post.js";
import {User} from "../model/user.js";
import path from "node:path";

class DatabaseServiceEmbedded implements DatabaseService {

    saveDatabaseToFile(filePath: string, database: Post[] | User[]): Promise<string> {

        return new Promise((resolve, reject) => {
            fs.mkdir(path.dirname(filePath), (err) => {
                if (err && err.code !== 'EEXIST')
                    reject("database directory not created")
                else {
                    const writeStream = fs.createWriteStream(filePath,
                        {encoding: "utf-8", flags: "w"})
                    writeStream.write(JSON.stringify(database))
                    writeStream.end();

                    writeStream.on("finish", () => {
                        writeStream.close();
                        resolve("database successfully saved to file");
                    })
                    writeStream.on('error', () => {
                        reject("database not saved to file");
                    })
                }
            })
        })
    }

    restoreDatabaseFromFile(filePath: string): Promise<object[]> {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(filePath, {highWaterMark: 32});
            let result = "";

            readStream.on('data', chunk => {
                if (chunk) {
                    result += chunk.toString();
                } else
                    reject("empty database file");
            })

            readStream.on('end', () => {
                readStream.close();
                try{
                    resolve([...JSON.parse(result)]);
                } catch (e) {
                    reject("error parsing database file");
                }
            })

            readStream.on('error', () => {
                readStream.close();
                reject("database file can't be read");
            })
        })
    }
}

export const databaseServiceEmbedded = new DatabaseServiceEmbedded();