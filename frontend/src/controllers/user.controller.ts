// Utils and Validators
import fetchServer from '../utils/fetchServer';
import validators from '../utils/validators';
const { validateName, validateEmail, validatePassword, validateRole } = validators;

// Types
import type { ControllerAll, GetByUserId, CreateUser, UpdateUserById, DeleteUserById, ChangePassword } from './../types/controller.types';
import type { CreatedUser, UpdatedUser, ChangedPassword } from './../types/request.body.types';
import type { UserType } from '../types/server.types';
import typeCheckers from './../utils/type.checkers';
const { hasRoleField } = typeCheckers;

const baseUrl: string = '/api/v1/users';

const getAllUsers = async ({ token, dispatch, e }: ControllerAll) => {
	if (e) e.preventDefault();
	await fetchServer<UserType[]>({ route: 'users', url: baseUrl, method: 'GET', token, dispatch });
};

const getUserById = async ({ userId, token, dispatch, e }: GetByUserId) => {
	if (e) e.preventDefault();
	await fetchServer<UserType>({ route: 'users', url: `${baseUrl}/${Number(userId)}`, method: 'GET', token, dispatch });
};

const createUser = async ({ token, state, dispatch, navigate, e }: CreateUser) => {
	if (e) e.preventDefault();
	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);
	const roleStatus = validateRole(state.roleField.value);

	if (nameStatus.error || emailStatus.error || passwordStatus.error || roleStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const user: CreatedUser = {
			name: state.nameField.value,
			email: state.emailField.value,
			password: state.passwordField.value,
			role: state.roleField.value,
		};

		await fetchServer<null>({ route: 'users', url: baseUrl, method: 'POST', token, body: user, dispatch, navigate });
	}
};

const updateUserById = async ({ userId, userRole, token, state, dispatch, login, navigate, e }: UpdateUserById) => {
	if (e) e.preventDefault();
	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const roleStatus = hasRoleField(state) ? validateRole(state.roleField.value) : { error: false };

	if (nameStatus.error || emailStatus.error || roleStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		let updatedUser: UpdatedUser = { name: state.nameField.value, email: state.emailField.value };

		if (hasRoleField(state)) updatedUser = { ...updatedUser, role: state.roleField.value };

		await fetchServer<null>({
			route: 'users',
			url: `${baseUrl}/${Number(userId)}`,
			method: 'PATCH',
			token,
			body: updatedUser,
			userId,
			userRole,
			state,
			dispatch,
			navigate,
			login,
		});
	}
};

const deleteUserById = async ({ userId, userRole, token, dispatch, logout, navigate, e }: DeleteUserById) => {
	if (e) e.preventDefault();
	await fetchServer<null>({
		route: 'users',
		url: `${baseUrl}/${Number(userId)}`,
		method: 'DELETE',
		token,
		userRole,
		dispatch,
		navigate,
		logout,
	});
};

const changePassword = async ({ userId, token, state, dispatch, e }: ChangePassword) => {
	if (e) e.preventDefault();
	const password: string = state.passwordField.value;
	const confirmPassword: string = state.confirmPasswordField.value;

	const passwordStatus = validatePassword(password);
	const confirmPasswordStatus = validatePassword(confirmPassword);

	if (password.trim() !== confirmPassword.trim()) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: `Passwords don't match.` } });
	} else if (passwordStatus.error || confirmPasswordStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const changedPassword: ChangedPassword = { password, confirmPassword };

		await fetchServer<null>({
			route: 'users',
			url: `${baseUrl}/change-password/${Number(userId)}`,
			method: 'PATCH',
			token,
			body: changedPassword,
			dispatch,
		});
	}
};

const controller = { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, changePassword };

export default controller;
