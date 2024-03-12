// bcrypt
import bcrypt from 'bcrypt';

// Database pool
import pool from './../config/database.js';

// Custom Error
import ApiError from './../utils/ApiError.js';

// Utils and validators
import sharedUtils from './../utils/controllerUtils/sharedUtils.js';
import authUtils from './../utils/controllerUtils/authUtils.js';
import validators from './../utils/validators.js';
const { getSingle } = sharedUtils;
const { createToken, authResponse } = authUtils;
const { validateInputs } = validators;

// Login controller
const login = async (req, res, next) => {
	const { email, password } = req.body;
	const { emailStatus, passwordStatus } = validateInputs(req.body);

	if (!emailStatus.error && !passwordStatus.error) {
		try {
			const result = await getSingle('email', email.trim(), 'users');

			if (result && (await bcrypt.compare(password.trim(), result.password))) {
				const token = createToken('login', result, email);
				authResponse(res, 'login', result, email, token);
			} else {
				throw new ApiError(401, 'Incorrect credentials.');
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

// Registration controller
const register = async (req, res, next) => {
	const { name, email, password } = req.body;
	const { nameStatus, emailStatus, passwordStatus } = validateInputs(req.body);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error) {
		try {
			const result = await getSingle('email', email.trim(), 'users');

			if (result) {
				throw new ApiError(422, 'Email already in use.');
			} else {
				try {
					const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
					const [result] = await pool.query(sql, [name.trim(), email.trim(), await bcrypt.hash(password.trim(), 12)]);

					if (result && result.affectedRows !== 0) {
						const token = createToken('register', result, email);
						authResponse(res, 'register', result, email, token);
					} else {
						throw new ApiError(500, 'Something went wrong.');
					}
				} catch (error) {
					return next(error);
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
