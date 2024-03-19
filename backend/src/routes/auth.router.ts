// Express
import express from 'express';
const router = express.Router();

// Controllers
import authController from '../controllers/auth.controller';
const { login, register } = authController;

// Middlewares
import errorHandler from '../middlewares/error.middleware';

// Open routes, everybody has access
router.route('/login').post(login);
router.route('/register').post(register);

router.use(errorHandler);

export default router;
