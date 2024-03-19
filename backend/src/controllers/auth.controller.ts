// Express
import { Response, NextFunction } from 'express';

// MySQL
import { ResultSetHeader } from 'mysql2';

// bcrypt
import bcrypt from 'bcrypt';

// Database pool
import pool from '../config/database';

// Custom Error
import ApiError from '../utils/ApiError';

// Utils and validators
import sharedUtils from '../utils/controllerUtils/sharedUtils';
import authUtils from '../utils/controllerUtils/authUtils';
import validators from '../utils/validators';
const { getSingle } = sharedUtils;
const { createToken, authResponse } = authUtils;
const { validateInputs } = validators;

// Types
import { UserType } from './../types/database.types';
import { ExtendedRequest } from './../types/request.types';

// Login controller
const login = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	const { emailStatus, passwordStatus } = validateInputs(req.body);

	if (!emailStatus.error && !passwordStatus.error) {
		try {
			const rows = await getSingle('email', email.trim(), 'users');
			if (rows && rows.length > 0) {
				const result: UserType = rows[0][0] as UserType;

				if (result && (await bcrypt.compare(password.trim(), result.password))) {
					const token: string = createToken(result, email);
					authResponse(res, 'login', result, email, token);
				} else {
					throw new ApiError(401, 'Incorrect credentials.');
				}
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

// Registration controller
const register = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const { name, email, password } = req.body;
	const { nameStatus, emailStatus, passwordStatus } = validateInputs(req.body);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error) {
		try {
			const rows = await getSingle('email', email.trim(), 'users');

			if (rows && rows.length > 0) {
				const result: UserType = rows[0][0] as UserType;

				if (result) {
					throw new ApiError(422, 'Email already in use.');
				} else {
					try {
						const sql: string = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
						const [result] = await pool.query<ResultSetHeader>(sql, [
							name.trim(),
							email.trim(),
							await bcrypt.hash(password.trim(), 12),
						]);

						if (result && result.affectedRows !== 0) {
							const token: string = createToken(result, email);
							authResponse(res, 'register', result, email, token);
						} else {
							throw new ApiError(500, 'Something went wrong.');
						}
					} catch (error) {
						return next(error);
					}
				}
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

const controller = { login, register };

export default controller;
