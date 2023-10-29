const express = require('express');
const taskModel = require('../model/task.model');
const deleteRouter = express.Router();

// delete task route
deleteRouter.get('/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const taskToEdit = await taskModel.findById(taskId);
        if (!taskToEdit) {
            return res.status(404).json({ error: 'Task not found!' });
        }
        res.status(200).render('delete', {
            title: 'Edit Task',
            task: taskToEdit,
            message: {},
            req: req,
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit the task!' })
    }
});

// delete
deleteRouter.post('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskToDelete = await taskModel.findById(taskId);
        if (!taskToDelete) {
            return res.status(404).json({ error: 'Task not found!' })
        }
        await taskModel.findByIdAndDelete(taskId);
        res.redirect('/tasks')
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the task!' })
    }
})

module.exports = deleteRouter;