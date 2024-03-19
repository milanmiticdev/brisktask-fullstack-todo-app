// Utils and Validators
import fetchServer from '../utils/fetchServer';
import validators from '../utils/validators';
const { validateName } = validators;

// Types
import type { ControllerAll, GetByUserId, GetByTaskId, CreateTask, UpdateTaskById, DeleteTaskById } from './../types/controller.types';
import type { CreatedTask } from './../types/request.body.types';
import type { TaskType } from '../types/server.types';

const baseUrl: string = '/api/v1/tasks';

const getAllTasks = async ({ token, dispatch, e }: ControllerAll) => {
	if (e) e.preventDefault();
	await fetchServer<TaskType[]>({ route: 'tasks', url: `${baseUrl}`, method: 'GET', token, dispatch });
};

const getTasksByUserId = async ({ userId, token, dispatch, e }: GetByUserId) => {
	if (e) e.preventDefault();
	await fetchServer<TaskType[]>({ route: 'tasks', url: `${baseUrl}/user/${Number(userId)}`, method: 'GET', token, dispatch });
};

const getTaskById = async ({ taskId, token, dispatch, e }: GetByTaskId) => {
	if (e) e.preventDefault();
	await fetchServer<TaskType>({ route: 'tasks', url: `${baseUrl}/${Number(taskId)}`, method: 'GET', token, dispatch });
};

const createTask = async ({ userId, token, state, dispatch, navigate, e }: CreateTask) => {
	if (e) e.preventDefault();

	const nameStatus = validateName(state.nameField.value);

	if (nameStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const task: CreatedTask = { name: state.nameField.value };

		await fetchServer<null>({
			route: 'tasks',
			url: `${baseUrl}/create/${Number(userId)}`,
			method: 'POST',
			token,
			body: task,
			dispatch,
			navigate,
		});
	}
};

const updateTaskById = async ({ taskId, userRole, token, state, dispatch, navigate, e }: UpdateTaskById) => {
	if (e) e.preventDefault();

	const nameStatus = validateName(state.nameField.value);

	if (nameStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		const updatedTask = { name: state.nameField.value };

		await fetchServer<null>({
			route: 'tasks',
			url: `${baseUrl}/${Number(taskId)}`,
			method: 'PATCH',
			token,
			body: updatedTask,
			userRole,
			dispatch,
			navigate,
		});
	}
};

const deleteTaskById = async ({ taskId, userRole, token, dispatch, navigate, e }: DeleteTaskById) => {
	if (e) e.preventDefault();

	await fetchServer<null>({
		route: 'tasks',
		url: `${baseUrl}/${Number(taskId)}`,
		method: 'DELETE',
		token,
		userRole,
		dispatch,
		navigate,
	});
};

const controller = { getAllTasks, getTasksByUserId, getTaskById, createTask, updateTaskById, deleteTaskById };

export default controller;
