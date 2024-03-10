// Utils and Validators
import fetchServer from './../utils/fetchServer.js';
import validators from './../utils/validators.js';
const { validateName } = validators;

const baseUrl = '/api/v1/tasks';

const getAllTasks = async (token, dispatch, e) => {
	if (e) e.preventDefault();
	await fetchServer('tasks', `${baseUrl}`, 'GET', token, null, dispatch, null, null, null, null, null, null);
};

const getTasksByUserId = async (userId, token, dispatch, e) => {
	if (e) e.preventDefault();
	await fetchServer('tasks', `${baseUrl}/user/${Number(userId)}`, 'GET', token, null, dispatch, null, null, null, null, null, null);
};

const getTaskById = async (taskId, token, dispatch, e) => {
	if (e) e.preventDefault();
	await fetchServer('tasks', `${baseUrl}/${Number(taskId)}`, 'GET', token, null, dispatch, null, null, null, null, null, null);
};

const createTask = async (userId, token, state, dispatch, navigate, e) => {
	if (e) e.preventDefault();

	const nameStatus = validateName(state.nameField.value);

	if (nameStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const task = { name: state.nameField.value };

		await fetchServer(
			'tasks',
			`${baseUrl}/create/${Number(userId)}`,
			'POST',
			token,
			task,
			dispatch,
			null,
			null,
			navigate,
			null,
			null,
			null
		);
	}
};

const updateTaskById = async (taskId, userRole, token, state, dispatch, navigate, e) => {
	if (e) e.preventDefault();

	const nameStatus = validateName(state.nameField.value);

	if (nameStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const updatedTask = { name: state.nameField.value };

		await fetchServer(
			'tasks',
			`${baseUrl}/${Number(taskId)}`,
			'PATCH',
			token,
			updatedTask,
			dispatch,
			null,
			userRole,
			navigate,
			null,
			null,
			null
		);
	}
};

const deleteTaskById = async (taskId, userRole, token, dispatch, navigate, e) => {
	if (e) e.preventDefault();

	await fetchServer('tasks', `${baseUrl}/${Number(taskId)}`, 'DELETE', token, null, dispatch, null, userRole, navigate, null, null);
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
