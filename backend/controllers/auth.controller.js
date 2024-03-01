// bcrypt and jsonwebtoken
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Database pool
import pool from './../config/database.js';

// Custom Error
import ApiError from './../utils/ApiError.js';

// Validation functions
import validators from './../utils/validators.js';
const { validateName, validateEmail, validatePassword } = validators;

// Config
import config from './../config/config.js';
const { jwtSecret, jwtExpires } = config;

// Login controller
const login = async (req, res, next) => {
	const { email, password } = req.body;

	const emailStatus = validateEmail(email);
	const passwordStatus = validatePassword(password);

	if (!emailStatus.error && !passwordStatus.error) {
		try {
			const sql = 'SELECT * FROM users WHERE email = ?';
			const [[result]] = await pool.query(sql, [email.trim()]);

			if (result && (await bcrypt.compare(password.trim(), result.password))) {
				// Creating a token
				const token = jwt.sign({ userId: result.id, userEmail: result.email, userRole: result.role }, jwtSecret, {
					expiresIn: jwtExpires,
				});

				return res.status(201).json({
					token,
					user: { id: result.id, email: result.email, role: result.role },
					message: 'Login successful.',
					status: 200,
				});
			} else {
				throw new ApiError(401, 'Incorrect credentials.');
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(400).json({ message: 'Invalid inputs.', status: 400 });
	}
};

// Registration controller
const register = async (req, res, next) => {
	const { name, email, password } = req.body;

	const nameStatus = validateName(name);
	const emailStatus = validateEmail(email);
	const passwordStatus = validatePassword(password);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error) {
		try {
			const sql = 'SELECT * FROM users WHERE email = ?';
			const [[result]] = await pool.query(sql, [email.trim()]);

			if (result) {
				throw new ApiError(422, 'User already exists.');
			} else {
				try {
					const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
					const [result] = await pool.query(sql, [name.trim(), email.trim(), await bcrypt.hash(password.trim(), 12)]);

					if (result && result.affectedRows !== 0) {
						// Creating a token
						const token = jwt.sign({ userId: result.insertId, userEmail: email.trim(), userRole: 'user' }, jwtSecret, {
							expiresIn: jwtExpires,
						});

						return res.status(201).json({
							token,
							user: { id: result.insertId, email: email.trim(), role: 'user' },
							message: 'Registration successful.',
							status: 201,
						});
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
		return res.status(400).json({ message: 'Invalid inputs.', status: 400 });
	}
};

const controller = { login, register };

export default controller;
