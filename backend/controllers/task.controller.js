// Database pool
import pool from './../config/database.js';

// Custom Error
import ApiError from './../utils/ApiError.js';

// Validation functions
import validators from './../utils/validators.js';
const { validateName } = validators;

const getAllTasks = async (req, res, next) => {
	const userData = req.userData;

	if (userData.role === 'admin') {
		try {
			const sql = 'SELECT * FROM tasks';
			const [result] = await pool.query(sql);

			if (result && result.length > 0) {
				return res.status(200).json({
					tasks: result.map(task => {
						return {
							id: task.id,
							name: task.name,
							userId: task.user_id,
							userEmail: task.user_email,
							createdAt: task.created_at,
							updatedAt: task.updated_at,
							section: 'tasks',
						};
					}),
					message: 'Tasks fetched.',
					status: 200,
				});
			} else {
				throw new ApiError(404, 'No tasks.');
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(403).json({ message: 'Not authorized.', status: 403 });
	}
};

const getTasksByUserId = async (req, res, next) => {
	const { userId } = req.params;
	const userData = req.userData;

	if (!userId) {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	} else if (userData.role === 'admin') {
		try {
			const sql = 'SELECT * FROM tasks WHERE user_id = ?';
			const [result] = await pool.query(sql, [Number(userId)]);

			if (result && result.length > 0) {
				return res.status(200).json({
					tasks: result.map(task => ({
						id: task.id,
						name: task.name,
						userId: task.user_id,
						userEmail: task.user_email,
						createdAt: task.created_at,
						updatedAt: task.updated_at,
						section: 'tasks',
					})),
					message: 'Tasks fetched.',
					status: 200,
				});
			} else {
				try {
					const sql = 'SELECT * FROM users WHERE id = ?';
					const [[result]] = await pool.query(sql, [Number(userId)]);

					if (result) {
						throw new ApiError(404, 'User has no tasks.');
					} else {
						throw new ApiError(404, `User doesn't exist.`);
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
				const sql = 'SELECT * FROM tasks WHERE user_id = ?';
				const [result] = await pool.query(sql, [userData.id]);

				if (result && result.length > 0) {
					return res.status(200).json({
						tasks: result.map(task => ({
							id: task.id,
							name: task.name,
							userId: task.user_id,
							userEmail: task.user_email,
							createdAt: task.created_at,
							updatedAt: task.updated_at,
							section: 'tasks',
						})),
						message: 'Tasks fetched.',
						status: 200,
					});
				} else {
					throw new ApiError(404, 'No tasks.');
				}
			} catch (error) {
				return next(error);
			}
		}
	}
};

const getTaskById = async (req, res, next) => {
	const { taskId } = req.params;
	const userData = req.userData;

	if (!taskId) {
		return res.status(400).json({ message: 'No task id.', status: 400 });
	} else if (userData.role === 'admin') {
		try {
			const sql = 'SELECT * FROM tasks WHERE id = ?';
			const [[result]] = await pool.query(sql, [Number(taskId)]);

			if (result) {
				return res.status(200).json({
					message: 'Task fetched.',
					task: {
						id: result.id,
						name: result.name,
						userId: result.user_id,
						userEmail: result.user_email,
						createdAt: result.created_at,
						updatedAt: result.updated_at,
						section: 'tasks',
					},
					status: 200,
				});
			} else {
				throw new ApiError(404, `Task doesn't exist.`);
			}
		} catch (error) {
			return next(error);
		}
	} else {
		try {
			const sql = 'SELECT * FROM tasks WHERE id = ?';
			const [[result]] = await pool.query(sql, [Number(taskId)]);

			if (!result) {
				throw new ApiError(404, `Task doesn't exist.`);
			} else if (result.user_id !== userData.id) {
				throw new ApiError(403, 'Not authorized.');
			} else {
				return res.status(200).json({
					message: 'Task fetched.',
					task: {
						id: result.id,
						name: result.name,
						userId: result.user_id,
						userEmail: result.user_email,
						createdAt: result.created_at,
						updatedAt: result.updated_at,
						section: 'tasks',
					},
					status: 200,
				});
			}
		} catch (error) {
			return next(error);
		}
	}
};

const createTask = async (req, res, next) => {
	const { name } = req.body;
	const { userId } = req.params;
	const userData = req.userData;
	const nameStatus = validateName(name);

	if (!nameStatus.error) {
		if (!userId) {
			return res.status(400).json({ message: 'No user id.', status: 400 });
		} else {
			if (Number(userId) !== userData.id) {
				return res.status(403).json({ message: 'Not authorized.', status: 403 });
			} else {
				try {
					const sql = 'INSERT INTO tasks (name, user_id, user_email) VALUES(?, ?, ?)';
					const [result] = await pool.query(sql, [name.trim(), userData.id, userData.email]);

					if (result && result.affectedRows !== 0) {
						return res.status(201).json({ message: 'Task created.', status: 201 });
					} else {
						throw new ApiError(500, 'Something went wrong.');
					}
				} catch (error) {
					return next(error);
				}
			}
		}
	} else {
		return res.status(400).json({ message: 'Invalid input.', status: 400 });
	}
};

const updateTaskById = async (req, res, next) => {
	const { taskId } = req.params;
	const { name } = req.body;
	const userData = req.userData;
	const nameStatus = validateName(name);

	if (!nameStatus.error) {
		if (!taskId) {
			return res.status(400).json({ message: 'No task id.', status: 400 });
		} else if (userData.role === 'admin') {
			try {
				const sql = 'SELECT * FROM tasks WHERE id = ?';
				const [[result]] = await pool.query(sql, [Number(taskId)]);

				if (!result) {
					throw new ApiError(404, `Task doesn't exist.`);
				} else {
					try {
						const sql = 'UPDATE tasks SET name = ? WHERE id = ?';
						const [result] = await pool.query(sql, [name.trim(), Number(taskId)]);

						if (result && result.affectedRows !== 0) {
							return res.status(200).json({ message: 'Task updated.', status: 200 });
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
			try {
				const sql = 'SELECT * FROM tasks WHERE id = ?';
				const [[result]] = await pool.query(sql, [Number(taskId)]);

				if (!result) {
					throw new ApiError(404, `Task doesn't exist.`);
				} else if (result.user_id !== userData.id) {
					throw new ApiError(403, 'Not authorized.');
				} else {
					try {
						const sql = 'UPDATE tasks SET name = ? WHERE id = ? AND user_id = ?';
						const [result] = await pool.query(sql, [name.trim(), Number(taskId), userData.id]);

						if (result && result.affectedRows !== 0) {
							return res.status(200).json({ message: 'Task updated.', status: 200 });
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
	} else {
		return res.status(400).json({ message: 'Invalid input.', status: 400 });
	}
};

const deleteTaskById = async (req, res, next) => {
	const { taskId } = req.params;
	const userData = req.userData;

	if (!taskId) {
		return res.status(400).json({ message: 'No task id.', status: 400 });
	} else if (userData.role === 'admin') {
		try {
			const sql = 'SELECT * FROM tasks WHERE id = ?';
			const [[result]] = await pool.query(sql, [Number(taskId)]);

			if (!result) {
				throw new ApiError(404, `Task doesn't exist.`);
			} else {
				try {
					const sql = 'DELETE FROM tasks WHERE id = ?';
					const [result] = await pool.query(sql, [Number(taskId)]);

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
		try {
			const sql = 'SELECT * FROM tasks WHERE id = ?';
			const [[result]] = await pool.query(sql, [Number(taskId)]);

			if (!result) {
				throw new ApiError(404, `Task doesn't exist.`);
			} else if (result.user_id !== userData.id) {
				throw new ApiError(403, 'Not authorized.');
			} else {
				try {
					const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
					const [result] = await pool.query(sql, [Number(taskId), userData.id]);

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
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
