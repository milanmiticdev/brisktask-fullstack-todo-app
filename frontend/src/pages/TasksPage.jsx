// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import Task from './../components/Task.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import Message from './../components/Message.jsx';

// Styles
import styles from './TasksPage.module.css';

// Initial reducer state
const initialState = {
	tasks: [],
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
		case 'tasks-fetched':
			return { ...state, tasks: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'error-check':
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

	useEffect(() => {
		const getTasks = async () => {
			try {
				dispatch({ type: 'loading-check', payload: true });
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
					dispatch({ type: 'tasks-fetched', payload: data.tasks });
					dispatch({ type: 'message-change', payload: '' });
					dispatch({ type: 'spinner-text-change', payload: '' });
					dispatch({ type: 'error-check', payload: false });
					dispatch({ type: 'loading-check', payload: false });
				} else {
					dispatch({ type: 'message-change', payload: data.message });
					dispatch({ type: 'spinner-text-change', payload: '' });
					dispatch({ type: 'error-check', payload: true });
					dispatch({ type: 'loading-check', payload: false });
				}
			} catch {
				dispatch({ type: 'message-change', payload: 'Something went wrong.' });
				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'error-check', payload: true });
				dispatch({ type: 'loading-check', payload: false });
			}
		};
		getTasks();
	}, [userId, token]);

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.tasks}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading &&
				!state.error &&
				state.tasks &&
				state.tasks.length > 0 &&
				state.tasks.map(task => <Task key={task.id} task={task} dispatch={dispatch} />)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default TasksPage;
