import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

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

app.use('auth');
app.use('/users');
app.use('/tasks');
