// Express
import { Response, NextFunction } from 'express';

// Utils and Validators
import sharedUtils from '../utils/controllerUtils/sharedUtils';
import taskUtils from '../utils/controllerUtils/taskUtils';
import validators from '../utils/validators';
const { getAll, getById, create, deleteById } = sharedUtils;
const { getByUserId, updateById } = taskUtils;
const { validateInputs } = validators;

// Types
import { ExtendedRequest } from './../types/request.types';

const getAllTasks = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const sql: string = `SELECT tasks.id AS 'id', tasks.name AS 'name', users.id AS 'user_id', users.email AS 'user_email', tasks.created_at AS 'created_at', tasks.updated_at AS 'updated_at' FROM tasks INNER JOIN users ON tasks.user_id = users.id ORDER BY id ASC`;
	await getAll(res, next, sql, 'tasks');
};

const getTasksByUserId = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { userId } = req.params;

	if (userId) {
		if (userData) await getByUserId(res, next, userData, Number(userId));
	} else {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	}
};

const getTaskById = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { taskId } = req.params;

	if (taskId) {
		if (userData) await getById(res, next, userData, Number(taskId), 'tasks');
	} else {
		return res.status(400).json({ message: 'No task id.', status: 400 });
	}
};

const createTask = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { userId } = req.params;
	const { nameStatus } = validateInputs(req.body);

	if (!nameStatus.error) {
		if (!userId) {
			return res.status(400).json({ message: 'No user id.', status: 400 });
		} else if (userData && userData.role === 'user' && Number(userId) !== userData.id) {
			return res.status(403).json({ message: 'Not authorized.', status: 403 });
		} else {
			if (userData) await create(req, res, next, userData, 'tasks');
		}
	} else {
		return res.status(400).json({ message: 'Check your input.', status: 400 });
	}
};

const updateTaskById = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { taskId } = req.params;
	const { nameStatus } = validateInputs(req.body);

	if (!nameStatus.error) {
		if (taskId) {
			if (userData) await updateById(req, res, next, userData, Number(taskId));
		} else {
			return res.status(400).json({ message: 'No task id.', status: 400 });
		}
	} else {
		return res.status(400).json({ message: 'Check your input.', status: 400 });
	}
};

const deleteTaskById = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { taskId } = req.params;

	if (taskId) {
		if (userData) await deleteById(res, next, userData, Number(taskId), 'tasks');
	} else {
		return res.status(400).json({ message: 'No task id.', status: 400 });
	}
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
