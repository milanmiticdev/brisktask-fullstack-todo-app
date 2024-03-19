// Express
import { Response, NextFunction } from 'express';

// MySQL
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// bcrypt
import bcrypt from 'bcrypt';

// Database pool
import pool from '../../config/database';

// Custom error
import ApiError from '../ApiError';

// Utilities
import { isResultUser, isResultTask } from './../type.checkers';

// Types
import { UserType, TaskType } from './../../types/database.types';
import { UserDataType, ExtendedRequest } from './../../types/request.types';

interface resultObj {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	section: string;
	email?: string;
	role?: string;
	userId?: number;
	userEmail?: string;
}

const getSingle = async (identifier: string, value: number | string, table: string) => {
	const sql: string =
		table === 'users'
			? `SELECT * FROM users WHERE ${identifier} = ?`
			: `SELECT tasks.id AS 'id', tasks.name AS 'name', users.id AS 'user_id', users.email AS 'user_email', tasks.created_at AS 'created_at', tasks.updated_at AS 'updated_at' FROM tasks INNER JOIN users ON ${identifier} = ? AND tasks.user_id = users.id`;

	const rows = await pool.query<RowDataPacket[]>(sql, [value]);

	return rows;
};

const getAll = async (res: Response, next: NextFunction, sql: string, table: string) => {
	try {
		const rows = await pool.query<RowDataPacket[]>(sql);

		if (rows && rows.length > 0) {
			const result: UserType[] | TaskType[] = rows[0] as UserType[] | TaskType[];

			if (result && result.length > 0) {
				return res.status(200).json({
					result: result.map((res: UserType | TaskType) => {
						let resultObject: resultObj = {
							id: res.id,
							name: res.name,
							createdAt: res.created_at,
							updatedAt: res.updated_at,
							section: table,
						};

						resultObject = isResultUser(res)
							? { ...resultObject, email: res.email, role: res.role }
							: { ...resultObject, userId: res.user_id, userEmail: res.user_email };

						return resultObject;
					}),
					message: `${table.charAt(0).toUpperCase() + table.slice(1)} fetched.`,
					status: 200,
				});
			} else {
				throw new ApiError(404, `No ${table}.`);
			}
		}
	} catch (error) {
		return next(error);
	}
};

const getById = async (res: Response, next: NextFunction, userData: UserDataType, id: number, table: string) => {
	try {
		const rows = table === 'tasks' ? await getSingle('tasks.id', Number(id), 'tasks') : await getSingle('id', Number(id), 'users');

		if (rows && rows.length > 0) {
			const result: UserType | TaskType = rows[0][0] as UserType | TaskType;

			if (
				(userData.role === 'user' && result && isResultTask(result) && result.user_id !== userData.id) ||
				(userData.role === 'user' && result && isResultUser(result) && Number(id) !== userData.id)
			) {
				throw new ApiError(403, 'Not authorized.');
			} else if (!result) {
				throw new ApiError(404, table === 'tasks' ? `Task doesn't exist.` : `User doesn't exist.`);
			} else {
				let resObject: resultObj = {
					id: result.id,
					name: result.name,
					createdAt: result.created_at,
					updatedAt: result.updated_at,
					section: table,
				};

				resObject = isResultUser(result)
					? { ...resObject, email: result.email, role: result.role }
					: { ...resObject, userId: result.user_id, userEmail: result.user_email };

				return res.status(200).json({
					message: table === 'tasks' ? 'Task fetched.' : 'User fetched.',
					result: resObject,
					status: 200,
				});
			}
		}
	} catch (error) {
		return next(error);
	}
};

const create = async (req: ExtendedRequest, res: Response, next: NextFunction, userData: UserDataType, table: string) => {
	const { name, email, password, role } = req.body;

	try {
		const columns = table === 'tasks' ? '(name, user_id)' : '(name, email, password, role)';
		const emptyValues = table === 'tasks' ? '(?, ?)' : '(?, ?, ?, ?)';

		const sql = `INSERT INTO ${table} ${columns} VALUES ${emptyValues}`;
		const values: [string, number] | [string, string, string, string] =
			table === 'tasks'
				? [name.trim(), userData.id]
				: [name.trim(), email.trim(), await bcrypt.hash(password.trim(), 12), role.trim()];

		const [result] = await pool.query<ResultSetHeader>(sql, values);

		if (result && result.affectedRows !== 0) {
			return res.status(201).json({ message: table === 'tasks' ? 'Task created.' : 'User created.', status: 201 });
		} else {
			throw new ApiError(500, 'Something went wrong.');
		}
	} catch (error) {
		return next(error);
	}
};

const deleteById = async (res: Response, next: NextFunction, userData: UserDataType, id: number, table: string) => {
	try {
		const rows = table === 'tasks' ? await getSingle('tasks.id', Number(id), 'tasks') : await getSingle('id', Number(id), 'users');

		if (rows && rows.length > 0) {
			const result: UserType | TaskType = rows[0][0] as UserType | TaskType;

			if (
				(userData.role === 'user' && result && isResultTask(result) && result.user_id !== userData.id) ||
				(userData.role === 'user' && result && isResultUser(result) && Number(id) !== userData.id)
			) {
				throw new ApiError(403, 'Not authorized.');
			} else if (!result) {
				throw new ApiError(404, table === 'tasks' ? `Task doesn't exist.` : `User doesn't exist.`);
			} else {
				try {
					const sql: string = `DELETE FROM ${table} WHERE id = ?`;
					const [result] = await pool.query<ResultSetHeader>(sql, [Number(id)]);

					if (result && result.affectedRows !== 0) {
						return res.status(204).end();
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

export default { getSingle, getAll, getById, create, deleteById };
