// Express
import express from 'express';
const router = express.Router();

// Controllers
import userController from '../controllers/user.controller';
const { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, changePassword } = userController;

// Middlewares
import authHandler from '../middlewares/auth.middleware';
import authAdminHandler from '../middlewares/auth.admin.middleware';
import errorHandler from '../middlewares/error.middleware';

// Protected routes, only authenticated users and admin have access
router.route('/change-password/:userId').patch(authHandler, changePassword);
router.route('/:userId').get(authHandler, getUserById).patch(authHandler, updateUserById).delete(authHandler, deleteUserById);

// Protected routes, only authenticated admin has access
router.route('/').get(authAdminHandler, getAllUsers).post(authAdminHandler, createUser);

router.use(errorHandler);

export default router;
