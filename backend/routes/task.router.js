// Express
import express from 'express';
const router = express.Router();

// Controllers
import taskController from './../controllers/task.controller.js';
const { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById } = taskController;

// Middlewares
import authHandler from './../middlewares/auth.middleware.js';
import authAdminHandler from './../middlewares/auth.admin.middleware.js';
import errorHandler from './../middlewares/error.middleware.js';

// Protected route, only authenticated admin has access
router.route('/all').get(authAdminHandler, getAllTasks);

// Protected routes, only authenticated users and admin have access
router
	.route('/:taskId')
	.get(authHandler, getTaskById)
	.patch(authHandler, updateTaskById)
	.delete(authHandler, deleteTaskById);
router.route('/').get(authHandler, getTasksByUserId).post(authHandler, createTask);

router.use(errorHandler);

export default router;
