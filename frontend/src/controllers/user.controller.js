import validators from './../utils/validators.js';
const { validateName, validateEmail, validatePassword, validateRole } = validators;

const getAllUsers = async (token, dispatch, e) => {
	if (e) {
		e.preventDefault();
	}

	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Loading' });

		const response = await fetch('http://localhost:5174/api/v1/users', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: null,
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-change', payload: data.users });
		} else {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'loading-change', payload: false });
		dispatch({ type: 'spinner-change', payload: '' });
	}
};

const getUserById = async (userId, token, dispatch, e) => {
	if (e) {
		e.preventDefault();
	}

	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Loading' });

		const response = await fetch(`http://localhost:5174/api/v1/users/${Number(userId)}`, {
			method: 'GET',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-change', payload: data.user });
			dispatch({ type: 'error-change', payload: false });
		} else {
			dispatch({ type: 'error-change', payload: true });
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'error-change', payload: true });
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'loading-change', payload: false });
		dispatch({ type: 'spinner-change', payload: '' });
	}
};

const createUser = async (token, state, dispatch, navigate, e) => {
	if (e) {
		e.preventDefault();
	}

	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);
	const roleStatus = validateRole(state.roleField.value);

	if (nameStatus.error || emailStatus.error || passwordStatus.error || roleStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		try {
			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Creating' });

			const user = {
				name: state.nameField.value,
				email: state.emailField.value,
				password: state.passwordField.value,
				role: state.roleField.value,
			};

			const response = await fetch('http://localhost:5174/api/v1/users/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(user),
			});
			const data = await response.json();

			if (data.status === 201) {
				navigate('/dashboard');
			} else {
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

const updateUserById = async (userId, userRole, token, state, dispatch, login, navigate, e) => {
	if (e) {
		e.preventDefault();
	}

	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const roleStatus = userRole === 'admin' ? validateRole(state.roleField.value) : { error: false };

	if (nameStatus.error || emailStatus.error || roleStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		try {
			let updatedUser;

			if (userRole === 'admin') {
				updatedUser = {
					name: state.nameField.value,
					email: state.emailField.value,
					role: state.roleField.value,
				};
			} else {
				updatedUser = {
					name: state.nameField.value,
					email: state.emailField.value,
				};
			}

			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Updating' });

			const response = await fetch(`http://localhost:5174/api/v1/users/${Number(userId)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedUser),
			});
			const data = await response.json();

			if (data.status === 200) {
				// If the email doesn't change there is no need to recreate token and login again
				if (state.result.email === state.emailField.value) {
					navigate(0);
				} else {
					if (userRole === 'user') {
						login(userId, userRole, data.token);
					}
					navigate(0);
				}
			} else {
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

const deleteUserById = async (userId, userRole, token, dispatch, logout, navigate, e) => {
	if (e) {
		e.preventDefault();
	}

	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Deleting' });

		const response = await fetch(`http://localhost:5174/api/v1/users/${Number(userId)}`, {
			method: 'DELETE',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.status === 204) {
			if (userRole === 'user') {
				logout();
				navigate('/');
			} else {
				navigate('/dashboard');
			}
		} else {
			const data = await response.json();
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'loading-change', payload: false });
		dispatch({ type: 'spinner-change', payload: '' });
	}
};

const changePassword = async (userId, token, state, dispatch, e) => {
	if (e) {
		e.preventDefault();
	}

	const password = state.passwordField.value;
	const confirmPassword = state.confirmPasswordField.value;

	const passwordStatus = validatePassword(password);
	const confirmPasswordStatus = validatePassword(confirmPassword);

	if (password.trim() !== confirmPassword.trim()) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: `Passwords don't match.` } });
	} else if (passwordStatus.error || confirmPasswordStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		try {
			const changedPassword = { password, confirmPassword };

			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Updating' });

			const response = await fetch(`http://localhost:5174/api/v1/users/change-password/${Number(userId)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(changedPassword),
			});
			const data = await response.json();

			if (data.status === 200) {
				dispatch({ type: 'modal-change', payload: { open: true, error: false, message: data.message } });
			} else {
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

const controller = { getAllUsers, getUserById, createUser, updateUserById, deleteUserById, changePassword };

export default controller;
