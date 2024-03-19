// Express
import { Response, NextFunction } from 'express';

// MySQL
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Database pool
import pool from '../../config/database';

// Custom Error
import ApiError from '../ApiError';

// Utils
import sharedUtils from './sharedUtils';
const { getSingle } = sharedUtils;

// Types
import { TaskType } from './../../types/database.types';
import { UserDataType, ExtendedRequest } from './../../types/request.types';

const getByUserId = async (res: Response, next: NextFunction, userData: UserDataType, id: number) => {
	try {
		const sql: string = `SELECT tasks.id AS 'id', tasks.name AS 'name', users.id AS 'user_id', users.email AS 'user_email', tasks.created_at AS 'created_at', tasks.updated_at AS 'updated_at' FROM tasks INNER JOIN users ON tasks.user_id = ? AND tasks.user_id = users.id ORDER BY id ASC`;
		const values: [number] = userData.role === 'admin' ? [Number(id)] : [userData.id];

		const rows = await pool.query<RowDataPacket[]>(sql, values);

		if (rows && rows.length > 0) {
			const result: TaskType[] = rows[0] as TaskType[];

			if (userData.role === 'user' && Number(id) !== userData.id) {
				return res.status(403).json({ message: 'Not authorized.', status: 403 });
			} else if (!result) {
				throw new ApiError(404, `User doesn't exist.`);
			} else if (result.length === 0) {
				throw new ApiError(404, 'No tasks.');
			} else {
				return res.status(200).json({
					result: result.map((task: TaskType) => ({
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
		}
	} catch (error) {
		return next(error);
	}
};

const updateById = async (req: ExtendedRequest, res: Response, next: NextFunction, userData: UserDataType, id: number) => {
	const { name } = req.body;

	try {
		const rows = await getSingle('tasks.id', Number(id), 'tasks');

		if (rows && rows.length > 0) {
			const result: TaskType = rows[0][0] as TaskType;

			if (userData.role === 'user' && result && result.user_id !== userData.id) {
				throw new ApiError(403, 'Not authorized.');
			} else if (!result) {
				throw new ApiError(404, `Task doesn't exist.`);
			} else {
				try {
					const sql: string =
						userData.role === 'admin'
							? 'UPDATE tasks SET name = ? WHERE id = ?'
							: 'UPDATE tasks SET name = ? WHERE id = ? AND user_id = ?';
					const values: [string, number] | [string, number, number] =
						userData.role === 'admin' ? [name.trim(), Number(id)] : [name.trim(), Number(id), userData.id];
					const [result] = await pool.query<ResultSetHeader>(sql, values);

					if (result && result.affectedRows !== 0) {
						return res.status(200).json({ message: 'Task updated.', status: 200 });
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

export default { getByUserId, updateById };
