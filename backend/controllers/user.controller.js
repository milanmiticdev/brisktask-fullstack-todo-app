// Database pool
import pool from './../config/database.js';

// Custom Error
import ApiError from './../utils/ApiError.js';

// Validation functions
import validation from './../utils/validation.js';
const { validateName, validateEmail, validatePassword } = validation;

const getAllUsers = async (req, res, next) => {
	const userData = req.userData;

	if (userData.role === 'admin') {
		const sql = 'SELECT * FROM users';

		try {
			const [result] = await pool.query(sql);

			if (result && result.length > 0) {
				return res.status(200).json({
					users: result.map(user => ({
						id: result.id,
						name: result.name,
						email: result.email,
						role: result.role,
						createdAt: result.created_at,
						updatedAt: result.updated_at,
					})),
					message: 'Users fetched.',
					status: 200,
				});
			} else {
				throw new ApiError(404, 'User does not exist.');
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(403).json({ message: 'Forbidden Access - Not Authorized.', status: 403 });
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
			const [[result]] = await pool.query(sql, userId);

			if (result) {
				return res.status(200).json({
					message: 'User found.',
					user: {
						id: user.id,
						name: user.name,
						userEmail: user.email,
						userRole: user.role,
						createdAt: task.created_at,
						updatedAt: task.updated_at,
					},
					status: 200,
				});
			} else {
				throw new HttpError(404, 'User does not exist.');
			}
		} catch (error) {
			return next(error);
		}
	} else {
		if (userId !== userData.id) {
			return res.status(401).json({ message: 'Forbidden Access - Not Authenticated.', status: 401 });
		} else {
			try {
				const sql = 'SELECT * FROM users WHERE id = ?';
				const [[result]] = await pool.query(sql, [userData.id]);

				if (!result) {
					throw new ApiError(404, 'User does not exist.');
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

	const nameState = validateName(name);
	const emailState = validateEmail(email);
	const passwordState = validatePassword(password);

	if (!nameState.error && !emailState.error && !passwordState.error) {
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
							return res.status(201).json({
								message: 'User created.',
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
			return res.status(403).json({ message: 'Forbidden Access - Not authorized.', status: 403 });
		}
	} else {
		return res.status(400).json({
			message: 'Invalid inputs',
			state: { nameState, emailState, passwordState },
			status: 400,
		});
	}
};

const updateUserById = async (req, res, next) => {
	const { name, email, password } = req.body;
	const { userId } = req.params;
	const userData = req.userData;

	const nameStatus = validateName(name);
	const emailStatus = validateEmail(email);
	const passwordStatus = validatePassword(password);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error) {
		if (!userId) {
			return res.status(400).json({ message: 'No user id.', status: 400 });
		} else if (userData.role === 'admin') {
			try {
				const sql = 'SELECT * FROM users WHERE id = ?';
				const [[result]] = await pool.query(sql, userId);

				if (!result) {
					throw new ApiError(404, 'User does not exist.');
				} else {
					try {
						const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
						const [result] = await pool.query(sql, [name.trim(), email.trim(), await bcrypt.hash(password.trim(), 12), userId]);

						if (result && result.affectedRows !== 0) {
							return res.status(200).json({
								message: 'User updated.',
								status: 200,
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
			if (userId !== userData.id) {
				return res.status(401).json({ message: 'Forbidden Access - Not Authenticated.', status: 401 });
			} else {
				try {
					const sql = 'SELECT * FROM users WHERE id = ?';
					const [[result]] = await pool.query(sql, userData.id);

					if (!result) {
						throw new ApiError(404, 'User does not exist.');
					} else {
						try {
							const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
							const [result] = await pool.query(sql, [
								name.trim(),
								email.trim(),
								await bcrypt.hash(password.trim(), 12),
								userData.id,
							]);

							if (result && result.affectedRows !== 0) {
								return res.status(200).json({
									message: 'User updated.',
									status: 200,
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
			}
		}
	} else {
		return res.status(400).json({
			message: 'Invalid inputs',
			state: { nameState, emailState, passwordState },
			status: 400,
		});
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
			const [[result]] = await pool.query(sql, [userId]);

			if (!result) {
				throw new ApiError(404, 'User does not exist.');
			} else {
				try {
					const sql = 'DELETE FROM users WHERE id = ?';
					const result = await pool.query(sql, [userId]);

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
		if (userId !== userData.id) {
			return res.status(401).json({ message: 'Forbidden Access - Not authenticated.', status: 404 });
		} else {
			try {
				const sql = 'SELECT * FROM users WHERE id = ?';
				const [[result]] = await pool.query(sql, [userData.id]);

				if (!result) {
					throw new ApiError(404, 'User does not exist.');
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

const controller = {
	getAllUsers: getAllUsers,
	getUserById: getUserById,
	createUser: createUser,
	updateUserById: updateUserById,
	deleteUserById: deleteUserById,
};

export default controller;
