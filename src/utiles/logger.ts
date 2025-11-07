import {EventEmitter} from "node:events";
import fs from 'fs';
import {logDir} from "../config/appConfig.js";

export type logData = {
    date: string;
    message: string;
    type: string;
}

class Logger extends EventEmitter {
    private filePath: string = "";
    private logArray: logData[] = [];
    private flagLogExists = false;

    logfileExist() {
        return this.flagLogExists;
    }

    setLogExist(flag: boolean) {
        this.flagLogExists = flag;
    }

    async createLogFile() {
        return new Promise((resolve, reject) => {
            const start = new Date().toISOString();

            this.filePath = './logs/log_' + start.replace(/:/g, '-') + '.txt';
            fs.mkdir(logDir, (err) => {
                if (err && err.code !== 'EEXIST')
                    reject("log directory not created")
                else {
                    fs.writeFile(this.filePath, "=============Server log file=============\n", err => {
                        if (err) reject("log file not created");
                        else {
                            resolve("log file created");
                            this.flagLogExists = true;
                        }
                    })
                }
            })
        })
    }

    addLogToArray(message: string | string[], type: string) {
        if (typeof message === 'string')
            this.logArray.push({date: new Date().toISOString(), message, type});
        else {
            message.forEach(message => {
                this.logArray.push({date: new Date().toISOString(), message, type});
            })
        }
    }

    getLogArray() {
        return [...this.logArray];
    }

    log(message: string | string[], type: string) {
        this.emit('logged', message, type);
    }

    save(message: string | string[], type: string) {
        this.emit('saved', message, type);
    }

    saveToFile(message: string | string[], type: string) {
        this.emit('saveToFile', this.filePath, message, type);
    }

    serverStop(message: string | string[], type: string) {
        this.emit('stop', this.filePath, message, type);
    }
}

export const myLogger = new Logger();

myLogger.on('logged', (message: string | string[], type) => {
    let result = "";
    if (typeof message === 'string')
        result = JSON.stringify({date: new Date().toISOString(), message, type});
    else {
        message.forEach(message => {
            result += JSON.stringify({date: new Date().toISOString(), message, type}) + '\n';
        })
    }
    console.log(result);
});

myLogger.on('saved', (message: string | string[], type: string) => {
    myLogger.log(message, type);
    myLogger.addLogToArray(message, type);
});

myLogger.on('saveToFile', (filePath: string, message: string | string[], type: string) => {
    myLogger.save(message, type);

    fs.access(filePath, fs.constants.F_OK, (err: any) => {
        if (err) {
            myLogger.setLogExist(false)
            myLogger.save("log file not found", 'service');
        } else {
            let result = "";
            if (typeof message === 'string')
                result = JSON.stringify({date: new Date().toISOString(), message, type});
            else{
                message.forEach(message => {
                    result += JSON.stringify({date: new Date().toISOString(), message, type});
                })
            }
            fs.appendFile(filePath, result, (err: any) => {
                if (err) myLogger.save("logs can't be saved to file", 'service');
            })
        }
    });
})

myLogger.on('stop', (filePath: string, message: string | string[], type: string) => {
    if (myLogger.logfileExist()) {
        let result = "";
        if (typeof message === 'string') result = JSON.stringify({date: new Date().toISOString(), message, type});
        else {
            message.forEach(message => {
                result += JSON.stringify({date: new Date().toISOString(), message, type});
            })
        }
        fs.appendFileSync(filePath, result);
    }
    myLogger.log(message, 'service');
})