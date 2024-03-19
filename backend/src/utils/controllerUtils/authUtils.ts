// Express
import { Response } from 'express';

// MySQL
import { ResultSetHeader } from 'mysql2';

// jsonwebtoken
import jwt from 'jsonwebtoken';

// Config
import config from '../../config/config';
const { jwtSecret, jwtExpires } = config;

// Types
import { UserType } from './../../types/database.types';

// Utilities
import { isResultUser } from '../type.checkers';

const createToken = (result: UserType | ResultSetHeader, email: string) => {
	const user = {
		userId: isResultUser(result) ? result.id : result.insertId,
		userEmail: isResultUser(result) ? result.email : email.trim(),
		userRole: isResultUser(result) ? result.role : 'user',
	};

	// Creating a token
	const token: string = jwt.sign(user, jwtSecret, {
		expiresIn: jwtExpires,
	});

	return token;
};

const authResponse = (res: Response, route: string, result: UserType | ResultSetHeader, email: string, token: string) => {
	const user = {
		userId: isResultUser(result) ? result.id : result.insertId,
		userEmail: isResultUser(result) ? result.email : email.trim(),
		userRole: isResultUser(result) ? result.role : 'user',
	};
	const json = { token, result: user, message: route === 'login' ? 'Login successful.' : 'Registration successful.', status: 201 };

	return res.status(201).json(json);
};

export default { createToken, authResponse };
