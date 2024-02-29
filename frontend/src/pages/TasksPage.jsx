// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import Task from './../components/Task.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import Message from './../components/Message.jsx';

// Utils
import taskController from './../utils/controllers/task.controller.js';

// Styles
import styles from './TasksPage.module.css';

// Initial reducer state
const initialState = {
	result: [],
	loading: false,
	error: false,
	message: '',
	spinnerText: '',
	modal: {
		isOpen: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state, action) => {
	switch (action.type) {
		case 'result-fetched':
			return { ...state, result: action.payload };
		case 'is-loading':
			return { ...state, loading: action.payload };
		case 'is-error':
			return { ...state, error: action.payload };
		case 'message-change':
			return { ...state, message: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, message: action.payload };
	}
};

const TasksPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);

	const { getTasksByUserId } = taskController;

	useEffect(() => {
		const handleGetTasksByUserId = async () => {
			await getTasksByUserId(userId, token, dispatch);
		};
		handleGetTasksByUserId();
	}, [userId, token, getTasksByUserId]);

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.tasks}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading &&
				!state.error &&
				state.result &&
				state.result.length > 0 &&
				state.result.map(task => <Task key={task.id} task={task} dispatch={dispatch} />)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default TasksPage;
