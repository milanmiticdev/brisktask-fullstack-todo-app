// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import Message from './../components/Message.jsx';

// Utils
import validation from './../utils/validation.js';

// Styles
import styles from './UpdateTaskPage.module.css';

// Initial reducer state
const initialState = {
	value: '',
	status: {
		error: true,
		message: '',
	},
	loading: false,
	error: false,
	message: '',
	spinnerText: '',
	modal: {
		isOpen: false,
		error: true,
		message: '',
	},
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case 'value-change':
			return { ...state, value: action.payload };
		case 'status-change':
			return { ...state, status: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'error-check':
			return { ...state, error: action.payload };
		case 'message-change':
			return { ...state, message: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const UpdateTaskPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { taskId } = useParams();
	const { token } = useContext(AuthContext);
	const { validateName } = validation;
	const navigate = useNavigate();

	useEffect(() => {
		const getTask = async () => {
			try {
				dispatch({ type: 'loading-check', payload: true });
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
					dispatch({ type: 'value-change', payload: data.task.name });
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
		getTask();
	}, [taskId, token]);

	const updateTask = async e => {
		e.preventDefault();

		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Updating' });

			const updatedTask = {
				name: state.value,
			};

			const response = await fetch(`http://localhost:5174/api/v1/tasks/${taskId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedTask),
			});
			const data = await response.json();

			if (data.status === 200) {
				navigate('/tasks');
			} else {
				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'loading-check', payload: false });
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'loading-check', payload: false });
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		}
	};

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.updateTaskPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading && !state.error && (
				<form onSubmit={updateTask} className={styles.form}>
					<label htmlFor="update_task" className={styles.label}>
						UPDATE TASK
					</label>
					<input
						className={styles.input}
						id="update_task"
						name="update_task"
						type="text"
						value={state.value}
						onChange={e => {
							dispatch({ type: 'value-change', payload: e.target.value });
							dispatch({ type: 'status-change', payload: validateName(e.target.value) });
						}}
					/>
					<Message message={state.status.message} />
					<button className={styles.createBtn} type="submit">
						UPDATE
					</button>
				</form>
			)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default UpdateTaskPage;
