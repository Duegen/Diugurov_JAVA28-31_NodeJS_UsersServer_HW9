import express, {NextFunction, Request, Response} from 'express'
import {apiRouter} from "./routers/apiRouter.js";
import {myLogger} from "./utiles/logger.js";
import {reqValidation} from "./errorHandler/checkRequest.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {userServiceEmbedded} from "./service/UserServiceEmbedded.js";
import {api, apiPost, apiUser, PORT} from "./config/appConfig.js";
import {loggerMW} from "./utiles/loggerMW.js";
import {HttpError} from "./errorHandler/HttpError.js";

export interface loggedRequest extends Request {
    message?: string
    flagLog?: boolean
}

export const launchServer = async () => {
    const app = express();

    const server = app.listen(PORT, async () => {
        console.log("Server runs at http://localhost:" + PORT);
        await myLogger.createLogFile().then((message) => {
            myLogger.saveToFile(["session starts", "server successfully started", message + ""], 'service');
        }).catch((message) => {
            myLogger.save(["session starts", "server successfully started", message + ""], 'service');
        })
        await userServiceEmbedded.restoreDataFromFile().then((message) => {
            myLogger.logfileExist() ? myLogger.saveToFile(message, 'service')
                : myLogger.save(message, 'service')
        }).catch(err => {
            myLogger.logfileExist() ? myLogger.saveToFile(err, 'service')
                : myLogger.save(err, 'service')
        });
    })

    app.use(express.json())

    // app.use((req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         express.json()
    //         next()
    //     } catch (err) {
    //         switch (req.path) {
    //             case api + apiUser: {
    //                 next(new HttpError(400, "invalid json", 'addUser'));
    //                 break;
    //             }
    //             case api + apiPost: {
    //                 next(new HttpError(400, "invalid json", 'addPost'));
    //                 break;
    //             }
    //         }
    //     }
    //
    // });
    //app.use(reqValidation) //errorHandler middleware
    //app.use(errorHandler) //error errorHandler middleware
    //app.use(loggerMW) //logger middleware
    app.use('/api', apiRouter);
    //app.use(loggerMW) //logger middleware
    app.use((request, response) => {
        response.status(404).send("Page not found")
    })

    app.use(errorHandler);

    process.on('SIGINT', shutdown); //server stopped by Ctrl+C
    process.on('uncaughtException', handleFatalError);
    process.on('unhandledRejection', handleFatalError);

    async function shutdown() {
        await userServiceEmbedded.saveDataToFile().then((message) => {
            myLogger.logfileExist() ? myLogger.serverStop(message, 'service')
                : myLogger.save(message, 'service')
        }).catch((err) => {
            myLogger.logfileExist() ? myLogger.serverStop(err, 'service')
                : myLogger.saveToFile(err, 'service')
        });

        myLogger.logfileExist() ? myLogger.serverStop("server shutdown....", 'service')
            : myLogger.save("server shutdown....", 'service');
        server.close(() => {
            myLogger.logfileExist() ? myLogger.serverStop(["all connections closed", "session finished"], 'service')
                : myLogger.save(["all connections closed", "session finished"], 'service');
            process.exit(0);
        });
    }

    function handleFatalError(err: any) {
        if (err instanceof Error) {
            myLogger.logfileExist() ? myLogger.serverStop(["server failed by fatal error \n" + err.message + "\n" + err.stack, "session finished"], 'service')
                : myLogger.save(["server failed by fatal error \n" + err.message + "\n" + err.stack, "session finished"], 'service');
        } else {
            myLogger.logfileExist() ? myLogger.serverStop(["server failed by fatal error \n" + err, "session finished"], 'service')
                : myLogger.save(["server failed by fatal error \n" + err, "session finished"], 'service');
        }
        server.close(() => process.exit(1));
    }
}