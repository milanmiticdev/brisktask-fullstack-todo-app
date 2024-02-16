// Database pool
import pool from './../config/database.js';

const getAllTasks = async (req, res, next) => {
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
						createdAt: task.created_at,
						updatedAt: task.updated_at,
					};
				}),
				message: 'Tasks found.',
				status: 200,
			});
		} else {
			throw new ApiError(404, 'Task list empty.');
		}
	} catch (error) {
		next(error);
	}
	res.status(200).json({ message: 'Success' });
};

const getTasksByUserId = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const getTaskById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const createTask = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const updateTaskById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const deleteTaskById = async (req, res, next) => {
	res.status(200).json({ message: 'Success' });
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
