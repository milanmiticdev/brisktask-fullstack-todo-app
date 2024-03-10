// Utils and Validators
import fetchServer from './../utils/fetchServer.js';
import validators from './../utils/validators.js';
const { validateName, validateEmail, validatePassword, validateRole } = validators;

const baseUrl = '/api/v1/users';

const getAllUsers = async (token, dispatch, e) => {
	if (e) e.preventDefault();
	await fetchServer('users', baseUrl, 'GET', token, null, dispatch, null, null, null, null, null, null);
};

const getUserById = async (userId, token, dispatch, e) => {
	if (e) e.preventDefault();
	await fetchServer('users', `${baseUrl}/${Number(userId)}`, 'GET', token, null, dispatch, null, null, null, null, null, null);
};

const createUser = async (token, state, dispatch, navigate, e) => {
	if (e) e.preventDefault();
	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);
	const roleStatus = validateRole(state.roleField.value);

	if (nameStatus.error || emailStatus.error || passwordStatus.error || roleStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const user = {
			name: state.nameField.value,
			email: state.emailField.value,
			password: state.passwordField.value,
			role: state.roleField.value,
		};

		await fetchServer('users', baseUrl, 'POST', token, user, dispatch, null, null, navigate, null, null, null);
	}
};

const updateUserById = async (userId, userRole, token, state, dispatch, login, navigate, e) => {
	if (e) e.preventDefault();
	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const roleStatus = userRole === 'admin' ? validateRole(state.roleField.value) : { error: false };

	if (nameStatus.error || emailStatus.error || roleStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		let updatedUser = { name: state.nameField.value, email: state.emailField.value };

		if (userRole === 'admin') updatedUser = { ...updatedUser, role: state.roleField.value };

		await fetchServer(
			'users',
			`${baseUrl}/${Number(userId)}`,
			'PATCH',
			token,
			updatedUser,
			dispatch,
			userId,
			userRole,
			navigate,
			login,
			null,
			state
		);
	}
};

const deleteUserById = async (userId, userRole, token, dispatch, logout, navigate, e) => {
	if (e) e.preventDefault();
	await fetchServer(
		'users',
		`${baseUrl}/${Number(userId)}`,
		'DELETE',
		token,
		null,
		dispatch,
		null,
		userRole,
		navigate,
		null,
		logout,
		null
	);
};

const changePassword = async (userId, token, state, dispatch, e) => {
	if (e) e.preventDefault();
	const password = state.passwordField.value;
	const confirmPassword = state.confirmPasswordField.value;

	const passwordStatus = validatePassword(password);
	const confirmPasswordStatus = validatePassword(confirmPassword);

	if (password.trim() !== confirmPassword.trim()) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: `Passwords don't match.` } });
	} else if (passwordStatus.error || confirmPasswordStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const changedPassword = { password, confirmPassword };

		await fetchServer(
			'users',
			`${baseUrl}/change-password/${Number(userId)}`,
			'PATCH',
			token,
			changedPassword,
			dispatch,
			null,
			null,
			null,
			null,
			null,
			null
		);
	}
};

const controller = { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, changePassword };

export default controller;
