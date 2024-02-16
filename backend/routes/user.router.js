// Express
import express from 'express';
const router = express.Router();

// Controllers
import userController from './../controllers/user.controller.js';
const { getAllUsers, getUserById, createUser, updateUserById, deleteUserById } = userController;

// Middlewares
import authHandler from './../middlewares/auth.middleware.js';
import authAdminHandler from './../middlewares/auth.admin.middleware.js';
import errorHandler from './../middlewares/error.middleware.js';

// Protected routes, only authenticated users and admin have access
router
	.route('/:userId')
	.get(authHandler, getUserById)
	.patch(authHandler, updateUserById)
	.delete(authHandler, deleteUserById);

// Protected routes, only authenticated admin has access
router.route('/').get(authAdminHandler, getAllUsers).post(authAdminHandler, createUser);

router.use(errorHandler);

export default router;
