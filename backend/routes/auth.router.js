import express from 'express';
const router = express.Router();

import authController from './../controllers/auth.controller.js';
const { login, register } = authController;

// Open routes, everybody has access
router.route('/login').post(login);
router.route('/register').post(register);

export default router;
