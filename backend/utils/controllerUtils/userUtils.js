// bcrypt and jsonwebtoken
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Database pool
import pool from './../../config/database.js';

// Custom Error
import ApiError from './../ApiError.js';

// Utils
import sharedUtils from './sharedUtils.js';
const { getSingle } = sharedUtils;

// Config
import config from './../../config/config.js';
const { jwtSecret, jwtExpires } = config;

const emailChangeCheck = async (res, next, userData, email, emailChanged, values) => {
	try {
		let sql;

		if (emailChanged) {
			if (userData.role === 'admin') {
				sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
			}
			if (userData.role === 'user') {
				sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
			}
		} else {
			if (userData.role === 'admin') {
				sql = 'UPDATE users SET name = ?, role = ? WHERE id = ?';
			}
			if (userData.role === 'user') {
				sql = 'UPDATE users SET name = ? WHERE id = ?';
			}
		}

		const [result] = await pool.query(sql, values);

		if (result && result.affectedRows !== 0) {
			const json = { message: 'User updated.', status: 200 };

			// Creating a token if the users change their email
			let token;
			if (emailChanged && userData.role === 'user') {
				token = jwt.sign({ userId: userData.id, userEmail: email.trim(), userRole: userData.role }, jwtSecret, {
					expiresIn: jwtExpires,
				});
			}

			return res.status(200).json(token ? { ...json, token } : json);
		} else {
			throw new ApiError(500, 'Something went wrong.');
		}
	} catch (error) {
		return next(error);
	}
};

const updateById = async (req, res, next, userData, id) => {
	const { name, email, role } = req.body;

	try {
		const result = await getSingle('id', Number(id), 'users');

		if (userData.role === 'user' && Number(id) !== userData.id) {
			throw new ApiError(403, 'Not authorized.');
		} else if (!result) {
			throw new ApiError(404, `User doesn't exist.`);
		} else {
			// If the email doesn't change just update the name and role
			if (result.email === email.trim()) {
				let values;

				if (userData.role === 'admin') {
					values = [name.trim(), role.trim(), Number(id)];
				}
				if (userData.role === 'user') {
					values = [name.trim(), Number(id)];
				}
				await emailChangeCheck(res, next, userData, email, false, values);
			} else {
				try {
					const result = await getSingle('email', email.trim(), 'users');

					if (result) {
						throw new ApiError(422, `Email already in use.`);
					} else {
						let values;

						if (userData.role === 'admin') {
							values = [name.trim(), email.trim(), role.trim(), Number(id)];
						}
						if (userData.role === 'user') {
							values = [name.trim(), email.trim(), Number(id)];
						}
						await emailChangeCheck(res, next, userData, email, true, values);
					}
				} catch (error) {
					return next(error);
				}
			}
		}
	} catch (error) {
		return next(error);
	}
};

const passChange = async (req, res, next, userData, id) => {
	const { password } = req.body;

	try {
		const result = await getSingle('id', Number(id), 'users');

		if (userData.role === 'user' && Number(id) !== userData.id) {
			throw new ApiError(403, 'Not authorized.');
		} else if (!result) {
			throw new ApiError(404, `User doesn't exist.`);
		} else {
			try {
				const sql = 'UPDATE users SET password = ? WHERE id = ?';
				const [result] = await pool.query(sql, [await bcrypt.hash(password.trim(), 12), Number(id)]);

				if (result && result.affectedRows !== 0) {
					return res.status(200).json({ message: 'Password changed.', status: 200 });
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
};

export default {
	updateById,
	passChange,
};
