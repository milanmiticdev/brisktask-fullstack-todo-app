// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from '../../contexts/AuthContext';

// Components
import Task from '../../components/tasks/Task';
import Modal from '../../components/shared/Modal';
import Page from '../../components/shared/Page';
import Spinner from '../../components/shared/Spinner';

// Controllers
import taskController from '../../controllers/task.controller';

// Types
import type { TaskType } from '../../types/server.types';
import type { TasksPageState, TasksPageAction } from './../../types/page.types';

// Initial reducer state
const initialState: TasksPageState = {
	result: [] as TaskType[],
	loading: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state: TasksPageState, action: TasksPageAction): TasksPageState => {
	switch (action.type) {
		case 'result-change':
			return { ...state, result: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const TasksPage = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);

	const { getTasksByUserId } = taskController;

	useEffect(() => {
		const handleGetTasksByUserId = async () => await getTasksByUserId({ userId, token, dispatch });
		handleGetTasksByUserId();
	}, [userId, token, getTasksByUserId]);

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading &&
				state.result &&
				state.result.length > 0 &&
				state.result.map(task => <Task key={task.id} task={task} onDispatch={dispatch} />)}
		</Page>
	);
};

export default TasksPage;
