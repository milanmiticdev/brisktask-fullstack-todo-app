import express from 'express';
const router = express.Router();

import taskController from './../controllers/task.controller.js';
const { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById } = taskController;

// Protected route, only authenticated admin has access
router.route('/all').get(getAllTasks);

// Protected routes, only authenticated users and admin have access
router.route('/:taskId').get(getTaskById).patch(updateTaskById).delete(deleteTaskById);
router.route('/').get(getTasksByUserId).post(createTask);

export default router;
