// Express
import { Response, NextFunction } from 'express';

// MySQL
import { ResultSetHeader } from 'mysql2';

// bcrypt and jsonwebtoken
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Database pool
import pool from '../../config/database';

// Custom Error
import ApiError from '../ApiError';

// Utils
import sharedUtils from './sharedUtils';
const { getSingle } = sharedUtils;

// Config
import config from '../../config/config';
const { jwtSecret, jwtExpires } = config;

// Types
import { UserType } from './../../types/database.types';
import { UserDataType, ExtendedRequest } from './../../types/request.types';

const emailChangeCheck = async (
	res: Response,
	next: NextFunction,
	userData: UserDataType,
	email: string,
	emailChanged: boolean,
	values: [string, number] | [string, string, number] | [string, string, string, number]
) => {
	try {
		let sql: string = 'UPDATE users SET name = ?';

		if (emailChanged) {
			if (userData.role === 'admin') {
				sql = `${sql}, email = ?, role = ? WHERE id = ?`;
			}
			if (userData.role === 'user') {
				sql = `${sql}, email = ? WHERE id = ?`;
			}
		} else {
			if (userData.role === 'admin') {
				sql = `${sql}, role = ? WHERE id = ?`;
			}
			if (userData.role === 'user') {
				sql = `${sql} WHERE id = ?`;
			}
		}

		const [result] = await pool.query<ResultSetHeader>(sql, values);

		if (result && result.affectedRows !== 0) {
			const json = { message: 'User updated.', status: 200 };

			// Creating a token if the users change their email
			let token: string | undefined = undefined;
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

const updateById = async (req: ExtendedRequest, res: Response, next: NextFunction, userData: UserDataType, id: number) => {
	const { name, email, role } = req.body;

	try {
		const rows = await getSingle('id', Number(id), 'users');

		if (rows && rows.length > 0) {
			const result: UserType = rows[0][0] as UserType;

			if (userData.role === 'user' && Number(id) !== userData.id) {
				throw new ApiError(403, 'Not authorized.');
			} else if (!result) {
				throw new ApiError(404, `User doesn't exist.`);
			} else {
				// If the email doesn't change just update the name and role
				if (result.email === email.trim()) {
					const values: [string, string, number] | [string, number] =
						userData.role === 'admin' ? [name.trim(), role.trim(), Number(id)] : [name.trim(), Number(id)];
					await emailChangeCheck(res, next, userData, email, false, values);
				} else {
					try {
						const rows = await getSingle('email', email.trim(), 'users');

						if (rows && rows.length > 0) {
							const result: UserType = rows[0][0] as UserType;

							if (result) {
								throw new ApiError(422, `Email already in use.`);
							} else {
								const values: [string, string, number] | [string, string, string, number] =
									userData.role === 'admin'
										? [name.trim(), email.trim(), role.trim(), Number(id)]
										: [name.trim(), email.trim(), Number(id)];
								await emailChangeCheck(res, next, userData, email, true, values);
							}
						}
					} catch (error) {
						return next(error);
					}
				}
			}
		}
	} catch (error) {
		return next(error);
	}
};

const passChange = async (req: ExtendedRequest, res: Response, next: NextFunction, userData: UserDataType, id: number) => {
	const { password } = req.body;

	try {
		const rows = await getSingle('id', Number(id), 'users');

		if (rows && rows.length > 0) {
			const result: UserType = rows[0][0] as UserType;

			if (userData.role === 'user' && Number(id) !== userData.id) {
				throw new ApiError(403, 'Not authorized.');
			} else if (!result) {
				throw new ApiError(404, `User doesn't exist.`);
			} else {
				try {
					const sql: string = 'UPDATE users SET password = ? WHERE id = ?';
					const [result] = await pool.query<ResultSetHeader>(sql, [await bcrypt.hash(password.trim(), 12), Number(id)]);

					if (result && result.affectedRows !== 0) {
						return res.status(200).json({ message: 'Password changed.', status: 200 });
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
};

export default {
	updateById,
	passChange,
};
