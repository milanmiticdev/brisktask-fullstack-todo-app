const getAllTasks = async (token, dispatch) => {
	try {
		dispatch({ type: 'is-loading', payload: true });
		dispatch({ type: 'spinner-text-change', payload: 'Loading' });

		const response = await fetch('http://localhost:5174/api/v1/tasks', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: null,
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-fetched', payload: data.tasks });
		} else {
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'is-loading', payload: false });
		dispatch({ type: 'spinner-text-change', payload: '' });
		dispatch({ type: 'is-selecting', payload: false });
	}
};

const getTasksByUserId = async (userId, token, dispatch) => {
	try {
		dispatch({ type: 'is-loading', payload: true });
		dispatch({ type: 'message-change', payload: '' });
		dispatch({ type: 'spinner-text-change', payload: 'Loading' });

		const response = await fetch(`http://localhost:5174/api/v1/tasks/user/${userId}`, {
			method: 'GET',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-fetched', payload: data.tasks });
			dispatch({ type: 'is-error', payload: false });
			dispatch({ type: 'message-change', payload: '' });
		} else {
			dispatch({ type: 'is-error', payload: true });
			dispatch({ type: 'message-change', payload: data.message });
		}
	} catch {
		dispatch({ type: 'is-error', payload: true });
		dispatch({ type: 'message-change', payload: 'Something went wrong.' });
	} finally {
		dispatch({ type: 'spinner-text-change', payload: '' });
		dispatch({ type: 'is-loading', payload: false });
	}
};

const getTaskById = async (taskId, token, dispatch) => {
	try {
		dispatch({ type: 'is-loading', payload: true });
		dispatch({ type: 'message-change', payload: '' });
		dispatch({ type: 'spinner-text-change', payload: 'Loading' });

		const response = await fetch(`http://localhost:5174/api/v1/tasks/${Number(taskId)}`, {
			method: 'GET',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-fetched', payload: data.task });
			dispatch({ type: 'is-error', payload: false });
			dispatch({ type: 'message-change', payload: '' });
		} else {
			dispatch({ type: 'is-error', payload: true });
			dispatch({ type: 'message-change', payload: data.message });
		}
	} catch {
		dispatch({ type: 'is-error', payload: true });
		dispatch({ type: 'message-change', payload: 'Something went wrong.' });
	} finally {
		dispatch({ type: 'spinner-text-change', payload: '' });
		dispatch({ type: 'is-loading', payload: false });
	}
};

const createTask = async (e, userId, token, state, dispatch, navigate) => {
	e.preventDefault();

	try {
		dispatch({ type: 'is-loading', payload: true });
		dispatch({ type: 'spinner-text-change', payload: 'Creating' });

		const task = {
			name: state.nameField.value,
		};

		const response = await fetch(`http://localhost:5174/api/v1/tasks/create/${userId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(task),
		});
		const data = await response.json();

		if (data.status === 201) {
			navigate('/tasks');
		} else {
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'is-loading', payload: false });
		dispatch({ type: 'spinner-text-change', payload: '' });
	}
};

const updateTaskById = async (e, taskId, token, userRole, navigate, dispatch, state = undefined) => {
	e.preventDefault();

	if (userRole === 'admin' && state && state.result.name === state.nameField.value) {
		dispatch({ type: 'is-editing', payload: false });
	} else {
		try {
			dispatch({ type: 'is-loading', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Updating' });

			const updatedTask = {
				name: state.nameField,
			};

			const response = await fetch(`http://localhost:5174/api/v1/tasks/${Number(taskId)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedTask),
			});
			const data = await response.json();

			if (data.status === 200) {
				userRole === 'admin' ? navigate(0) : navigate('/tasks');
			} else {
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'is-loading', payload: false });
		}
	}
};

const deleteTaskById = async (taskId, token, userRole, dispatch, navigate) => {
	try {
		dispatch({ type: 'is-loading', payload: true });
		dispatch({ type: 'spinner-text-change', payload: 'Deleting' });

		const response = await fetch(`http://localhost:5174/api/v1/tasks/${Number(taskId)}`, {
			method: 'DELETE',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.status === 204) {
			userRole === 'admin' ? navigate('/dashboard') : navigate(0);
		} else {
			const data = await response.json();
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'spinner-text-change', payload: '' });
		dispatch({ type: 'is-loading', payload: false });
	}
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
