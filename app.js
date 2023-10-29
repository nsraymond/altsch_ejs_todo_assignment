const express = require('express')
require('dotenv').config()
const {connectToMongoDB} = require('./config/db.js')
const usersRouter = require('./user/user.route.js')
const viewRouter = require('./views/views.router.js')
const taskRouter = require('./task/task.router.js')
const app = express()

// connect to db
connectToMongoDB();

//port
const PORT = process.env.PORT;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// view engine
app.set('view engine','ejs')
app.use('/views', viewRouter)

// use routers
app.use('/', usersRouter)
app.use('/', taskRouter)

// handle error page
app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})

// server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
    }
)