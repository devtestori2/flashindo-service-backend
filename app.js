const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const notFoundMiddleware = require("./app/middleware/not-found")
const handleErrorMiddleware = require("./app/middleware/handler-error")
const usersRouter = require("./app/api/users/router")
const authRouter = require("./app/api/auth/router")
const tasksRouter = require("./app/api/tasks/router")
const cors = require("cors")




const app = express();
const prefix = '/api'

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req,res,next) => {
    return res.send("hello world")
})

app.use(`/users`,usersRouter)
app.use(`/auth`, authRouter)
app.use(`/tasks`, tasksRouter)
// middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);
module.exports = app;
