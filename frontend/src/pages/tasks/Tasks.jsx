// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../../contexts/AuthContext.js';

// Components
import Task from './../../components/tasks/Task.jsx';
import Modal from './../../components/shared/Modal.jsx';
import Page from './../../components/shared/Page.jsx';
import Spinner from './../../components/shared/Spinner.jsx';

// Controllers
import taskController from './../../controllers/task.controller.js';

// Initial reducer state
const initialState = {
	result: [],
	loading: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state, action) => {
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

const TasksPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);

	const { getTasksByUserId } = taskController;

	useEffect(() => {
		const handleGetTasksByUserId = async () => await getTasksByUserId(userId, token, dispatch);
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
