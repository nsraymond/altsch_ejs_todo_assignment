const express = require('express')
const middleware = require('./user.middleware.js')
const controller = require('./user.controllers.js')

const userRouter = express.Router();

// signup
userRouter.post('/signup', middleware.ValidateUserCreation, controller.CreateUser)

// login
userRouter.post('/login', middleware.ValidateUserLogin, controller.LoginUser)

module.exports = userRouter;


