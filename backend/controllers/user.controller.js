// Custom Error
import ApiError from './../utils/ApiError.js';

// Utils and validators
import sharedUtils from '../utils/controllerUtils/sharedUtils.js';
import userUtils from '../utils/controllerUtils/userUtils.js';
import validators from './../utils/validators.js';
const { getSingle, getAll, getById, create, deleteById } = sharedUtils;
const { updateById, passChange } = userUtils;
const { validateInputs } = validators;

const getAllUsers = async (req, res, next) => {
	const sql = 'SELECT * FROM users ORDER BY id ASC';
	await getAll(res, next, sql, 'users');
};

const getUserById = async (req, res, next) => {
	const userData = req.userData;
	const { userId } = req.params;

	if (userId) {
		await getById(res, next, userData, Number(userId), 'users');
	} else {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	}
};

const createUser = async (req, res, next) => {
	const userData = req.userData;
	const { email } = req.body;
	const { nameStatus, emailStatus, passwordStatus, roleStatus } = validateInputs(req.body);

	if (!nameStatus.error && !emailStatus.error && !passwordStatus.error && !roleStatus.error) {
		try {
			const result = await getSingle('email', email.trim(), 'users');

			if (result) {
				throw new ApiError(422, 'User already exists.');
			} else {
				await create(req, res, next, userData, 'users');
			}
		} catch (error) {
			return next(error);
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

const updateUserById = async (req, res, next) => {
	const userData = req.userData;
	const { userId } = req.params;
	const { nameStatus, emailStatus, roleStatus } = validateInputs(req.body);

	if (!nameStatus.error && !emailStatus.error && (userData.role === 'user' || !roleStatus.error)) {
		if (userId) {
			await updateById(req, res, next, userData, Number(userId));
		} else {
			return res.status(400).json({ message: 'No user id.', status: 400 });
		}
	} else {
		return res.status(400).json({ message: 'Check your inputs.', status: 400 });
	}
};

const deleteUserById = async (req, res, next) => {
	const userData = req.userData;
	const { userId } = req.params;

	if (userId) {
		await deleteById(res, next, userData, Number(userId), 'users');
	} else {
		return res.status(400).json({ message: 'No user id.', status: 400 });
	}
};

const changePassword = async (req, res, next) => {
	const userData = req.userData;
	const { userId } = req.params;
	const { password, confirmPassword } = req.body;
	const { passwordStatus, confirmPasswordStatus } = validateInputs(req.body);

	if (!passwordStatus.error && !confirmPasswordStatus.error) {
		if (password === confirmPassword) {
			if (userId) {
				await passChange(req, res, next, userData, Number(userId));
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
