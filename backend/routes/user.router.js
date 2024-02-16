import express from 'express';
const router = express.Router();

import userController from './../controllers/user.controller.js';
const { getAllUsers, getUserById, createUser, updateUserById, deleteUserById } = userController;

// Protected routes, only authenticated users and admin have access
router.route('/:userId').get(getUserById).patch(updateUserById).delete(deleteUserById);

// Protected routes, only authenticated admin has access
router.route('/').get(getAllUsers).post(createUser);

export default router;
