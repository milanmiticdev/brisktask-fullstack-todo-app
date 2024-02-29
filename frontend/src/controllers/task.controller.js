const getAllTasks = async (token, dispatch) => {
	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Loading' });

		const response = await fetch('http://localhost:5174/api/v1/tasks', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: null,
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-change', payload: data.tasks });
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

const getTasksByUserId = async (userId, token, dispatch) => {
	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Loading' });

		const response = await fetch(`http://localhost:5174/api/v1/tasks/user/${Number(userId)}`, {
			method: 'GET',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-change', payload: data.tasks });
			dispatch({ type: 'error-change', payload: false });
		} else {
			dispatch({ type: 'error-change', payload: true });
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'error-change', payload: true });
		dispatch({ type: 'modal-change', payload: 'Something went wrong.' });
	} finally {
		dispatch({ type: 'spinner-change', payload: '' });
		dispatch({ type: 'loading-change', payload: false });
	}
};

const getTaskById = async (taskId, token, dispatch) => {
	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Loading' });

		const response = await fetch(`http://localhost:5174/api/v1/tasks/${Number(taskId)}`, {
			method: 'GET',
			body: null,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-change', payload: data.task });
			dispatch({ type: 'error-change', payload: false });
		} else {
			dispatch({ type: 'error-change', payload: true });
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'error-change', payload: true });
		dispatch({ type: 'modal-change', payload: 'Something went wrong.' });
	} finally {
		dispatch({ type: 'spinner-change', payload: '' });
		dispatch({ type: 'loading-change', payload: false });
	}
};

const createTask = async (e, userId, token, state, dispatch, navigate) => {
	e.preventDefault();

	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Creating' });

		const task = {
			name: state.nameField.value,
		};

		const response = await fetch(`http://localhost:5174/api/v1/tasks/create/${Number(userId)}`, {
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
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'loading-change', payload: false });
		dispatch({ type: 'spinner-change', payload: '' });
	}
};

const updateTaskById = async (e, taskId, userRole, token, state, dispatch, navigate) => {
	e.preventDefault();

	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Updating' });

		const updatedTask = {
			name: state.nameField.value,
		};

		console.log(updatedTask);

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
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'spinner-change', payload: '' });
		dispatch({ type: 'loading-change', payload: false });
	}
};

const deleteTaskById = async (taskId, userRole, token, dispatch, navigate) => {
	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: 'Deleting' });

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
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'spinner-change', payload: '' });
		dispatch({ type: 'loading-change', payload: false });
	}
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
