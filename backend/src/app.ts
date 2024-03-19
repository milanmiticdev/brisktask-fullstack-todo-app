import express, { Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import taskRouter from './routes/task.router';

// Types
import { ExtendedRequest } from './types/request.types';

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

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

app.use(express.static(path.join(path.resolve(), '/frontend/dist')));

app.get('*', (req: ExtendedRequest, res: Response) => {
	res.sendFile(path.join(path.resolve(), 'frontend', 'dist', 'index.html'));
});

app.listen(5174);
