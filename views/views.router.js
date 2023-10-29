const express = require("express")
const userServices = require("../user/user.service.js")
const cookieParser = require("cookie-parser")
const TaskModel = require("../model/task.model.js")
const taskService = require("../task/task.controller.js")
const taskRouter = require("../task/task.router.js")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const viewRouter = express.Router()

viewRouter.use(cookieParser());
viewRouter.use('/tasks', taskRouter)

// home
viewRouter.get("/", (req, res) => {
  res.render("home");
});

// signup
viewRouter.get("/signup", (req, res) => {
  const message = "";
  res.render("signup",  { user: req.user, message })  ;
});

// login
viewRouter.get("/login", (req, res) => { 
  res.render("login");
 });

// signup post
viewRouter.post("/signup", async (req, res) => {
  try {
    const response = await userServices.Signup({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    if (response.success) {
        res.redirect("login");
    } else {
      const message = response.message;
        res.render("signup", { message, user: req.user })   
    }
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});

// login post
viewRouter.post("/login", async (req, res) => {
  try{
  const response = await userServices.Login({
    email: req.body.email,
    password: req.body.password,
  });
  if (response.success ) {
    res.cookie("jwt", response.data.token, {maxAge: 1000 * 60 * 60 * 24});
    res.redirect("task");
  } else {
    const message = response.message;
    res.render("login", { message, user: req.user })
  }
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});

// middleware cookies
viewRouter.use(async (req, res, next) => {
      const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decodedValue
            next()
        } catch (error) {
            res.redirect('/views/login')
        }
    } else {
        res.redirect('/views/login')
    }
})

// task
viewRouter.get('/task', async (req, res) => {
  const user_id = res.locals.user.id;
  const response = await taskService.getTasks(user_id);
  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });
});

// completed task
viewRouter.get('/task/completed', async (req, res) => {
  const user_id = res.locals.user.id;
  const response = await taskService.getCompletedTasks(user_id);
  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });
})

// pending task
viewRouter.get('/task/pending', async (req, res) => {
  const user_id = res.locals.user.id;
  const response = await taskService.getPendingTasks(user_id);
  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });
})

// create task
viewRouter.get('/task/create', (req, res) => {
  res.render('create')
} )
viewRouter.post('/task/create', async (req, res) => {
  req.body.user_id = res.locals.user.id;
  const response = await taskService.createTask(req.body);
  if (response.code === 200) {
      res.redirect('/views/task')
  } else {
      res.render('create', { error: response.message })
  }
})

// edit task
viewRouter.get('/views/task/edit/<%= task._id %>', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.render('edit', { task });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
viewRouter.post('/views/task/edit/<%= task._id %>', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTaskData = {
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
    };
    await TaskModel.findByIdAndUpdate(taskId, updatedTaskData);
    res.redirect('/views/task');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

viewRouter.get('/edit/:id', async(req, res) => {
  try {
      const taskId = req.params.id;
      const taskToEdit = await taskModel.findById(taskId);
      if (!taskToEdit) {
          return res.status(404).json({ error: 'Task not found!' });
      }
      res.status(200).render('edit', {
          title: 'Edit Task',
          links: [{ link_name: 'Logout', url: '/logout' }],
          task: taskToEdit,
          message: {},
          req: req,
      })
  } catch (error) {
      res.status(500).json({ error: 'Failed to edit the task!' })
  }
});

viewRouter.post('/edit/:id', async(req, res) => {
  try {
      const taskId = req.params.id;
      const { title, description, state } = req.body;
      const updatedTask = await taskModel.findByIdAndUpdate(
          taskId,
          { title, description, state },
          { new: true }
      );
      if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found!' });
      }
      res.redirect('task')
  } catch (error) {
      res.status(500).json({ error: 'Failed to update the task!' });
  }
})

// logout
viewRouter.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('home');
})


module.exports = viewRouter;