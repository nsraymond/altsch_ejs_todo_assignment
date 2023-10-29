// task_controller.js
const TaskModel = require ('../model/task.model')

// create task
const createTask = async (task) => {
  const taskFromRequest = task;
  const newTask = new TaskModel();
  newTask.title = taskFromRequest.title;
  newTask.description = taskFromRequest.description;
  newTask.state = taskFromRequest.state;
  newTask.user_id = taskFromRequest.user_id;
  const savedTask = await newTask.save();
  return {
      code: 200,
      success: true,
      message: 'Task created successfully',
      data: {
          task: savedTask
      }
  }
}  

// get tasks
const getTasks = async (user_id) => {
  const tasks = await TaskModel.find({ user_id });
  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}

// delete task
const deleteTask = (req, res) => {
  const id = req.params.id
  TaskModel.findByIdAndRemove(id)
      .then(book => {
          res.redirect("/task")
      }).catch(err => {
          res.status(500).send(err)
      })
}

// completed tasks
const getCompletedTasks = async (user_id) => {
  const tasks = await TaskModel.find({ user_id, state: 'completed' });
  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}

//pending tasks
const getPendingTasks = async (user_id) => {
  const tasks = await TaskModel.find({ user_id, state: 'pending' });
  return {
    code: 200,
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks
    }
  };
}


module.exports = {
  createTask,
  getTasks,
  deleteTask,
  getCompletedTasks,
  getPendingTasks
}