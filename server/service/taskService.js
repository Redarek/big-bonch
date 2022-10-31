const taskModel = require('../models/taskModel');

class TaskService {

    async createTask(taskData) {
        // сохраняем таск в БД 
        const task = await taskModel.create(taskData); 
        return task;
    }

    async getAllTasks() {
        const tasks = await taskModel.find();
        // sort tasks
        return tasks;
    }
}

module.exports = new TaskService();