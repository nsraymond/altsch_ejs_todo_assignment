const controller = require('./task.controller')
const express = require('express')
const editRouter = require('./task.edit')
const deleteRouter = require('./task.delete')
const taskRouter = express.Router()
const getRouter = require('./task.get')


// create task route
taskRouter.post('/create', controller.createTask)

// get tasks route
taskRouter.use('/tasks', getRouter)

// edit task route
taskRouter.use('/edit', editRouter)

// delete task route
taskRouter.use('/delete', deleteRouter)


module.exports = taskRouter;