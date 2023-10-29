const express = require('express')
const getRouter = express.Router()
const taskService = require('./task.controller')
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

// cookie parser middleware
getRouter.use(cookieParser());
getRouter.use(async (req, res, next) => {
    const token = req.cookies.jwt;
  if (token) {
      try {
          const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
          res.locals.user = decodedValue
          next()
      } catch (error) {
      }
  } else {
      res.redirect('/login')
  }
})
getRouter.get('/', async (req, res) => {
    const user_id = res.locals.user.id;
     const response = await taskService.getTasks(user_id);
    res.render('task', { 
      user: res.locals.user, 
      tasks: response.data.tasks
    });
  });
getRouter.get('/task/create', (req, res) => {
    res.render('create')
  } )


module.exports = getRouter;