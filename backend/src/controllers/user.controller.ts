// Express
import { Response, NextFunction } from 'express';

// Custom Error
import ApiError from '../utils/ApiError';

// Utils and validators
import sharedUtils from '../utils/controllerUtils/sharedUtils';
import userUtils from '../utils/controllerUtils/userUtils';
import validators from '../utils/validators';
const { getSingle, getAll, getById, create, deleteById } = sharedUtils;
const { updateById, passChange } = userUtils;
const { validateInputs } = validators;

// Types
import { UserType } from './../types/database.types';
import { ExtendedRequest } from './../types/request.types';

const getAllUsers = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const sql: string = 'SELECT * FROM users ORDER BY id ASC';
	await getAll(res, next, sql, 'users');
};

const getUserById = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { userId } = req.params;

	if (userId) {
		if (userData) await getById(res, next, userData, Number(userId), 'users');
	} else {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	}
};

const createUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { email } = req.body;
	const { nameStatus, emailStatus, passwordStatus, roleStatus } = validateInputs(req.body);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error && !roleStatus.error) {
		try {
			const rows = await getSingle('email', email.trim(), 'users');

			if (rows && rows.length > 0) {
				const result: UserType = rows[0][0] as UserType;

				if (result) {
					throw new ApiError(422, 'User already exists.');
				} else {
					if (userData) await create(req, res, next, userData, 'users');
				}
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

const updateUserById = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { userId } = req.params;
	const { nameStatus, emailStatus, roleStatus } = validateInputs(req.body);

	if (!nameStatus.error && !emailStatus.error && ((userData && userData.role === 'user') || !roleStatus.error)) {
		if (userId) {
			if (userData) await updateById(req, res, next, userData, Number(userId));
		} else {
			return res.status(400).json({ message: 'No user id.', status: 400 });
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

const deleteUserById = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { userId } = req.params;

	if (userId) {
		if (userData) await deleteById(res, next, userData, Number(userId), 'users');
	} else {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	}
};

const changePassword = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	const userData = req.userData;
	const { userId } = req.params;
	const { password, confirmPassword } = req.body;
	const { passwordStatus, confirmPasswordStatus } = validateInputs(req.body);

	if (!passwordStatus.error && !confirmPasswordStatus.error) {
		if (password === confirmPassword) {
			if (userId) {
				if (userData) await passChange(req, res, next, userData, Number(userId));
			} else {
				return res.status(400).json({ message: 'No user id.', status: 400 });
			}
		} else {
			return res.status(400).json({ message: `Passwords don't match.`, status: 400 });
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

const controller = { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, changePassword };

export default controller;
