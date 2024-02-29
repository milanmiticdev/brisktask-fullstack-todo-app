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

const getAllUsers = async (req, res, next) => {
	const userData = req.userData;

	if (userData.role === 'admin') {
		const sql = 'SELECT * FROM users';

		try {
			const [result] = await pool.query(sql);

			if (result && result.length > 0) {
				return res.status(200).json({
					users: result.map(user => ({
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
						createdAt: user.created_at,
						updatedAt: user.updated_at,
						section: 'users',
					})),
					message: 'Users fetched.',
					status: 200,
				});
			} else {
				throw new ApiError(404, `User doesn't exist.`);
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(403).json({ message: 'Not Authorized.', status: 403 });
	}
};

const getUserById = async (req, res, next) => {
	const { userId } = req.params;
	const userData = req.userData;

	if (!userId) {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	} else if (userData.role === 'admin') {
		try {
			const sql = 'SELECT * FROM users WHERE id = ?';
			const [[result]] = await pool.query(sql, Number(userId));

			if (result) {
				return res.status(200).json({
					message: 'User found.',

					user: {
						id: result.id,
						name: result.name,
						email: result.email,
						role: result.role,
						createdAt: result.created_at,
						updatedAt: result.updated_at,
						section: 'users',
					},
					status: 200,
				});
			} else {
				throw new HttpError(404, `User doesn't exist.`);
			}
		} catch (error) {
			return next(error);
		}
	} else {
		if (Number(userId) !== userData.id) {
			return res.status(403).json({ message: 'Not Authorized.', status: 403 });
		} else {
			try {
				const sql = 'SELECT * FROM users WHERE id = ?';
				const [[result]] = await pool.query(sql, [userData.id]);

				if (!result) {
					throw new ApiError(404, `User doesn't exist.`);
				} else {
					return res.status(200).json({
						message: 'User found.',

						status: 200,
						user: {
							id: result.id,
							name: result.name,
							email: result.email,
							role: result.role,
							createdAt: result.created_at,
							updatedAt: result.updated_at,
							section: 'users',
						},
					});
				}
			} catch (error) {
				return next(error);
			}
		}
	}
};

const createUser = async (req, res, next) => {
	const { name, email, password } = req.body;
	const userData = req.userData;

	const nameStatus = validateName(name);
	const emailStatus = validateEmail(email);
	const passwordStatus = validatePassword(password);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error) {
		if (userData.role === 'admin') {
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
							return res.status(201).json({ message: 'User created.', status: 201 });
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
			return res.status(403).json({ message: 'Not authorized.', status: 403 });
		}
	} else {
		return res.status(400).json({ message: 'Invalid inputs.', status: { nameStatus, emailStatus, passwordStatus }, status: 400 });
	}
};

const updateUserById = async (req, res, next) => {
	const { name, email, role } = req.body;
	const { userId } = req.params;
	const userData = req.userData;

	const nameStatus = validateName(name);
	const emailStatus = validateEmail(email);

	if (!nameStatus.error && !emailStatus.error) {
		if (!userId) {
			return res.status(400).json({ message: 'No user id.', status: 400 });
		} else if (userData.role === 'admin') {
			try {
				const sql = 'SELECT * FROM users WHERE id = ?';
				const [[result]] = await pool.query(sql, Number(userId));

				if (!result) {
					throw new ApiError(404, `User doesn't exist.`);
				} else {
					try {
						if (role && (role.trim() === 'admin' || role.trim() === 'user')) {
							const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
							const [result] = await pool.query(sql, [name.trim(), email.trim(), role.trim(), Number(userId)]);

							if (result && result.affectedRows !== 0) {
								return res.status(200).json({ message: 'User updated.', status: 200 });
							} else {
								throw new ApiError(500, 'Something went wrong.');
							}
						} else {
							throw new ApiError(400, `Invalid user role.`);
						}
					} catch (error) {
						return next(error);
					}
				}
			} catch (error) {
				return next(error);
			}
		} else {
			if (Number(userId) !== userData.id) {
				return res.status(403).json({ message: 'Not Authorized.', status: 403 });
			} else {
				try {
					const sql = 'SELECT * FROM users WHERE id = ?';
					const [[result]] = await pool.query(sql, userData.id);

					if (!result) {
						throw new ApiError(404, `User doesn't exist.`);
					} else {
						// If the email doesn't change there is no need to recreate a token
						if (result.email === email.trim()) {
							try {
								const sql = 'UPDATE users SET name = ? WHERE id = ?';
								const [result] = await pool.query(sql, [name.trim(), userData.id]);

								if (result && result.affectedRows !== 0) {
									return res.status(200).json({ message: 'User updated.', status: 200 });
								} else {
									throw new ApiError(500, 'Something went wrong.');
								}
							} catch (error) {
								return next(error);
							}
						} else {
							try {
								const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
								const [result] = await pool.query(sql, [name.trim(), email.trim(), userData.id]);

								if (result && result.affectedRows !== 0) {
									// Creating a token
									const token = jwt.sign(
										{ userId: userData.id, userEmail: email.trim(), userRole: userData.role },
										jwtSecret,
										{ expiresIn: jwtExpires }
									);

									return res.status(200).json({ token, message: 'User updated.', status: 200 });
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
			}
		}
	} else {
		return res.status(400).json({ message: 'Invalid inputs.', status: { nameStatus, emailStatus }, status: 400 });
	}
};

const deleteUserById = async (req, res, next) => {
	const { userId } = req.params;
	const userData = req.userData;

	if (!userId) {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	} else if (userData.role === 'admin') {
		try {
			const sql = 'SELECT * FROM users WHERE id = ?';
			const [[result]] = await pool.query(sql, [Number(userId)]);

			if (!result) {
				throw new ApiError(404, `User doesn't exist.`);
			} else {
				try {
					const sql = 'DELETE FROM users WHERE id = ?';
					const result = await pool.query(sql, [Number(userId)]);

					if (result && result.affectedRows !== 0) {
						return res.status(204).end();
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
		if (Number(userId) !== userData.id) {
			return res.status(403).json({ message: 'Not authorized.', status: 403 });
		} else {
			try {
				const sql = 'SELECT * FROM users WHERE id = ?';
				const [[result]] = await pool.query(sql, [userData.id]);

				if (!result) {
					throw new ApiError(404, `User doesn't exist.`);
				} else {
					try {
						const sql = 'DELETE FROM users WHERE id = ?';
						const result = await pool.query(sql, [userData.id]);

						if (result && result.affectedRows !== 0) {
							return res.status(204).end();
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
		}
	}
};

const changePassword = async (req, res, next) => {
	const { password, confirmPassword } = req.body;
	const { userId } = req.params;
	const userData = req.userData;

	const passwordStatus = validatePassword(password);
	const confirmPasswordStatus = validatePassword(confirmPassword);

	if (!passwordStatus.error && !confirmPasswordStatus.error) {
		if (password === confirmPassword) {
			if (!userId) {
				return res.status(400).json({ message: 'No user id.', status: 400 });
			} else if (userData.role === 'admin') {
				try {
					const sql = 'SELECT * FROM users WHERE id = ?';
					const [[result]] = await pool.query(sql, Number(userId));

					if (!result) {
						throw new ApiError(404, `User doesn't exist.`);
					} else {
						try {
							const sql = 'UPDATE users SET password = ? WHERE id = ?';
							const [result] = await pool.query(sql, [await bcrypt.hash(password.trim(), 12), Number(userId)]);

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
			} else {
				if (Number(userId) !== userData.id) {
					return res.status(403).json({ message: 'Not Authorized.', status: 403 });
				} else {
					try {
						const sql = 'SELECT * FROM users WHERE id = ?';
						const [[result]] = await pool.query(sql, userData.id);

						if (!result) {
							throw new ApiError(404, `User doesn't exist.`);
						} else {
							try {
								const sql = 'UPDATE users SET password = ? WHERE id = ?';
								const [result] = await pool.query(sql, [await bcrypt.hash(password.trim(), 12), userData.id]);

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
				}
			}
		} else {
			return res.status(400).json({ message: `Passwords don't match.`, status: 400 });
		}
	} else {
		return res.status(400).json({ message: 'Invalid inputs.', status: { passwordStatus, confirmPasswordStatus }, status: 400 });
	}
};

const controller = { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, changePassword };

export default controller;
