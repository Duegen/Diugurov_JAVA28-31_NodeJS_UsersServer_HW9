import express from "express";
import {usersRouter} from "./usersRouter.js";
import {loggerRouter} from "./loggerRouter.js";
import {postsRouter} from "./postsRouter.js";

export const apiRouter = express.Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/logger',loggerRouter);
apiRouter.use('/posts', postsRouter);