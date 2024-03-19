// Express
import express from 'express';
const router = express.Router();

// Controllers
import taskController from '../controllers/task.controller';
const { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById } = taskController;

// Middlewares
import authHandler from '../middlewares/auth.middleware';
import authAdminHandler from '../middlewares/auth.admin.middleware';
import errorHandler from '../middlewares/error.middleware';

// Protected routes, only authenticated users and admin have access
router.route('/user/:userId').get(authHandler, getTasksByUserId);
router.route('/create/:userId').post(authHandler, createTask);
router.route('/:taskId').get(authHandler, getTaskById).patch(authHandler, updateTaskById).delete(authHandler, deleteTaskById);

// Protected route, only authenticated admin has access
router.route('/').get(authAdminHandler, getAllTasks);

router.use(errorHandler);

export default router;
