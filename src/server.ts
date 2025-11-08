import express from 'express'
import {apiRouter} from "./routers/apiRouter.js";
import {myLogger} from "./utiles/logger.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {PORT} from "./config/appConfig.js";
import {databaseControllerEmbedded as database} from "./controllers/DatabaseController.js";
import {userServiceEmbedded} from "./service/UserServiceEmbedded.js";
import {postServiceEmbedded} from "./service/PostServiceEmbedded.js";

export const launchServer = async () => {
    const app = express();

    const server = app.listen(PORT, async () => {
        console.log("Server runs at http://localhost:" + PORT);
        await myLogger.createLogFile().then((message) => {
            myLogger.saveToFile(["session starts", "server successfully started", message + ""], 'service');
        }).catch((message) => {
            myLogger.save(["session starts", "server successfully started", message + ""], 'service');
        })
        await database.restoreDataFromFile().catch(() => {
            userServiceEmbedded.setDefaultDatabase()
            postServiceEmbedded.setDefaultDatabase()
            myLogger.logfileExist() ? myLogger.saveToFile('users and posts database not loaded from file, default database is implemented', 'service')
                : myLogger.save('users and posts database not loaded from file, default database is implemented', 'service');
        })
    })

    app.use(express.json())
    app.use('/api', apiRouter);
    app.use((request, response) => {
        response.status(404).send("Page not found")
    })
    app.use(errorHandler);

    process.on('SIGINT', shutdown); //server stopped by Ctrl+C
    process.on('uncaughtException', handleFatalError);
    process.on('unhandledRejection', handleFatalError);

    async function shutdown() {
        await database.saveDatabaseToFile()

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