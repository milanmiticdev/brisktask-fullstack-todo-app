// bcrypt
import bcrypt from 'bcrypt';

// Database pool
import pool from './../../config/database.js';

// Custom error
import ApiError from './../ApiError.js';

const getSingle = async (identifier, value, table) => {
	let sql;

	if (table === 'tasks') {
		sql = `SELECT tasks.id AS 'id', tasks.name AS 'name', users.id AS 'user_id', users.email AS 'user_email', tasks.created_at AS 'created_at', tasks.updated_at AS 'updated_at' FROM tasks INNER JOIN users ON ${identifier} = ? AND tasks.user_id = users.id`;
	}
	if (table === 'users') {
		sql = `SELECT * FROM users WHERE ${identifier} = ?`;
	}

	const [[result]] = await pool.query(sql, [value]);

	return result;
};

const getAll = async (res, next, sql, table) => {
	try {
		const [result] = await pool.query(sql);

		if (result && result.length > 0) {
			return res.status(200).json({
				result: result.map(res => {
					let resultObject = {
						id: res.id,
						name: res.name,
						createdAt: res.created_at,
						updatedAt: res.updated_at,
						section: table,
					};

					if (table === 'users') {
						resultObject = { ...resultObject, email: res.email, role: res.role };
					}

					if (table === 'tasks') {
						resultObject = { ...resultObject, userId: res.user_id, userEmail: res.user_email };
					}

					return resultObject;
				}),
				message: `${table.charAt(0).toUpperCase() + table.slice(1)} fetched.`,
				status: 200,
			});
		} else {
			throw new ApiError(404, `No ${table}.`);
		}
	} catch (error) {
		return next(error);
	}
};

const getById = async (res, next, userData, id, table) => {
	try {
		const result = table === 'tasks' ? await getSingle('tasks.id', Number(id), 'tasks') : await getSingle('id', Number(id), 'users');

		if (
			(userData.role === 'user' && table === 'tasks' && result.user_id !== userData.id) ||
			(userData.role === 'user' && table === 'users' && Number(id) !== userData.id)
		) {
			throw new ApiError(403, 'Not authorized.');
		} else if (!result) {
			throw new ApiError(404, table === 'tasks' ? `Task doesn't exist.` : `User doesn't exist.`);
		} else {
			let resObject = {
				id: result.id,
				name: result.name,
				createdAt: result.created_at,
				updatedAt: result.updated_at,
				section: table,
			};

			if (table === 'tasks') {
				resObject = { ...resObject, userId: result.user_id, userEmail: result.user_email };
			}

			if (table === 'users') {
				resObject = { ...resObject, email: result.email, role: result.role };
			}

			return res.status(200).json({
				message: table === 'tasks' ? 'Task fetched.' : 'User fetched.',
				result: resObject,
				status: 200,
			});
		}
	} catch (error) {
		return next(error);
	}
};

const create = async (req, res, next, userData, table) => {
	const { name, email, password, role } = req.body;

	try {
		const columns = table === 'tasks' ? '(name, user_id)' : '(name, email, password, role)';
		const emptyValues = table === 'tasks' ? '(?, ?)' : '(?, ?, ?, ?)';

		const sql = `INSERT INTO ${table} ${columns} VALUES ${emptyValues}`;
		let values;

		if (table === 'tasks') {
			values = [name.trim(), userData.id];
		}
		if (table === 'users') {
			values = [name.trim(), email.trim(), await bcrypt.hash(password.trim(), 12), role.trim()];
		}

		const [result] = await pool.query(sql, values);

		if (result && result.affectedRows !== 0) {
			return res.status(201).json({ message: table === 'tasks' ? 'Task created.' : 'User created.', status: 201 });
		} else {
			throw new ApiError(500, 'Something went wrong.');
		}
	} catch (error) {
		return next(error);
	}
};

const deleteById = async (res, next, userData, id, table) => {
	try {
		const result = table === 'tasks' ? await getSingle('tasks.id', Number(id), 'tasks') : await getSingle('id', Number(id), 'users');

		if (
			(userData.role === 'user' && table === 'tasks' && result.user_id !== userData.id) ||
			(userData.role === 'user' && table === 'users' && Number(id) !== userData.id)
		) {
			throw new ApiError(403, 'Not authorized.');
		} else if (!result) {
			throw new ApiError(404, table === 'tasks' ? `Task doesn't exist.` : `User doesn't exist.`);
		} else {
			try {
				const sql = `DELETE FROM ${table} WHERE id = ?`;
				const [result] = await pool.query(sql, [Number(id)]);

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
};

export default { getSingle, getAll, getById, create, deleteById };
