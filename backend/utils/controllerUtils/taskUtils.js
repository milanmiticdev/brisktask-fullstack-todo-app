// Database pool
import pool from '../../config/database.js';

// Custom Error
import ApiError from './../ApiError.js';

// Utils
import sharedUtils from './sharedUtils.js';
const { getSingle } = sharedUtils;

const getByUserId = async (res, next, userData, id) => {
	try {
		const sql = `SELECT tasks.id AS 'id', tasks.name AS 'name', users.id AS 'user_id', users.email AS 'user_email', tasks.created_at AS 'created_at', tasks.updated_at AS 'updated_at' FROM tasks INNER JOIN users ON tasks.user_id = ? AND tasks.user_id = users.id ORDER BY id ASC`;
		let values;

		if (userData.role === 'admin') {
			values = [Number(id)];
		}
		if (userData.role === 'user') {
			values = [userData.id];
		}
		const [result] = await pool.query(sql, values);

		if (userData.role === 'user' && Number(id) !== userData.id) {
			return res.status(403).json({ message: 'Not authorized.', status: 403 });
		} else if (!result) {
			throw new ApiError(404, `User doesn't exist.`);
		} else if (result.length === 0) {
			throw new ApiError(404, 'No tasks.');
		} else {
			return res.status(200).json({
				result: result.map(task => ({
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
		}
	} catch (error) {
		return next(error);
	}
};

const updateById = async (req, res, next, userData, id) => {
	const { name } = req.body;

	try {
		const result = await getSingle('tasks.id', Number(id), 'tasks');

		if (userData.role === 'user' && result.user_id !== userData.id) {
			throw new ApiError(403, 'Not authorized.');
		} else if (!result) {
			throw new ApiError(404, `Task doesn't exist.`);
		} else {
			try {
				let sql, values;
				if (userData.role === 'admin') {
					sql = 'UPDATE tasks SET name = ? WHERE id = ?';
					values = [name.trim(), Number(id)];
				}
				if (userData.role === 'user') {
					sql = 'UPDATE tasks SET name = ? WHERE id = ? AND user_id = ?';
					values = [name.trim(), Number(id), userData.id];
				}
				const [result] = await pool.query(sql, values);

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
};

export default { getByUserId, updateById };
