const getAllUsers = async (token, dispatch) => {
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

const getUserById = async (userId, token, dispatch) => {
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

const updateUserById = async (e, userId, userRole, token, state, dispatch, login, navigate) => {
	e.preventDefault();

	try {
		const updatedUser = {
			name: state.nameField.value,
			email: state.emailField.value,
		};
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
			if (state.user.email === state.emailField.value) {
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
};

const deleteUserById = async (userId, token, dispatch, logout, navigate) => {
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
			logout();
			navigate('/');
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

const changePassword = async (e, userId, token, state, dispatch) => {
	e.preventDefault();

	const changedPassword = {
		password: state.passwordField.value,
		confirmPassword: state.confirmPasswordField.value,
	};

	try {
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
};

const controller = { getAllUsers, getUserById, updateUserById, deleteUserById, changePassword };

export default controller;
