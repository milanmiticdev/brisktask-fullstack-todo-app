import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/config.js';

import authRouter from './routes/auth.router.js';
import taskRouter from './routes/task.router.js';
import userRouter from './routes/user.router.js';

const app = express();

// Setting HTTP response headers
app.use(helmet());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(
	cors({
		origin: '*',
		allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
		preflightContinue: false,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	})
);

app.use('/auth', authRouter);
app.use('/users', taskRouter);
app.use('/tasks', userRouter);

const { serverHostname, serverPort } = config;

app.listen(serverPort, () => `Server started on ${serverHostname}:${serverPort}`);
