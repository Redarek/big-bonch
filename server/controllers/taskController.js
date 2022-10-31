const taskService = require('../service/taskService');
const userModel = require('../models/userModel');
const taskModel = require('../models/taskModel');

class TaskController {
    async createTask(req, res, next) {
        try {
            const {employee, spec, title, text, firstReward, secondReward, penalty, start, firstEnd, secondEnd} = req.body;
            const task = new taskModel({user: req.user.id, employee, spec, title, text, firstReward, secondReward, penalty, start, firstEnd, secondEnd});
            const taskData = await taskService.createTask(task);
            return res.json(taskData);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getTasksForDay(req, res, next) {
        try {
            
        } catch (error) {
            next(error);
        }
    }

    async getTasksForWeek(req, res, next) {
        try {
            
        } catch (error) {
            next(error);
        }
    }

    async getTasksForMonth(req, res, next) {
        try {
            
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req, res, next) {
        try {
            const tasks = await taskService.getAllTasks();
            return res.json(tasks)
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();