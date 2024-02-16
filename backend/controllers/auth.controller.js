// bcrypt and jsonwebtoken
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Database pool
import pool from './../config/database.js';

// Custom Error
import ApiError from './../utils/ApiError.js';

// Validation functions
import validation from './../utils/validation.js';
const { validateName, validateEmail, validatePassword } = validation;

// Config
import config from './../config/config.js';
const { jwtSecret, jwtExpires } = config;

// Login controller
const login = async (req, res, next) => {
	const { email, password } = req.body;

	const emailState = validateEmail(email);
	const passwordState = validatePassword(password);

	if (!emailState.error && !passwordState.error) {
		try {
			const sql = 'SELECT * FROM users WHERE email = ?';
			const [[result]] = await pool.query(sql, [email.trim()]);

			if (result && (await bcrypt.compare(password.trim(), result.password))) {
				// Creating a token
				const token = jwt.sign(
					{ userId: result.id, userEmail: result.email, userRole: result.role },
					jwtSecret,
					{
						expiresIn: jwtExpires,
					}
				);

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
			next(error);
		}
	} else {
		return res.status(403).json({
			message: 'Invalid inputs',
			state: { emailState, passwordState },
			status: 403,
		});
	}
};

// Registration controller
const register = async (req, res, next) => {
	const { name, email, password } = req.body;

	const nameState = validateName(name);
	const emailState = validateEmail(email);
	const passwordState = validatePassword(password);

	if (!nameState.error && !emailState.error && !passwordState.error) {
		try {
			const sql = 'SELECT * FROM users WHERE email = ?';
			const [[result]] = await pool.query(sql, [email.trim()]);

			if (result) {
				throw new ApiError(422, 'User already exists.');
			} else {
				// Hashing a password
				let hashedPassword;
				try {
					hashedPassword = await bcrypt.hash(password.trim(), 12);
				} catch (error) {
					next(error);
				}

				try {
					const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
					const [result] = await pool.query(sql, [name.trim(), email.trim(), hashedPassword]);

					if (result && result.affectedRows !== 0) {
						// Creating a token
						const token = jwt.sign(
							{ userId: result.insertId, userEmail: email.trim(), userRole: 'user' },
							jwtSecret,
							{
								expiresIn: jwtExpires,
							}
						);

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
					next(error);
				}
			}
		} catch (error) {
			next(error);
		}
	} else {
		return res.status(403).json({
			message: 'Invalid inputs',
			state: { nameState, emailState, passwordState },
			status: 403,
		});
	}
};

const controller = { login, register };

export default controller;
