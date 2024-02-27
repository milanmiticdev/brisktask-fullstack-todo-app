// React
import { useReducer, useContext } from 'react';

// Contenxt
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import Message from './../components/Message.jsx';

// Utils
import validation from './../utils/validation.js';

// Styles
import styles from './CreateTaskPage.module.css';

// Initial reducer state
const initialState = {
	value: '',
	initialEmptyState: true,
	status: {
		error: true,
		message: '',
	},
	loading: false,
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
		case 'initial-empty-state-change':
			return { ...state, initialEmptyState: action.payload };
		case 'status-change':
			return { ...state, status: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const CreateTaskPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);
	const { validateName } = validation;
	const navigate = useNavigate();

	const createTask = async e => {
		e.preventDefault();

		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Creating' });

			const task = {
				name: state.value,
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
		<section className={state.loading ? `${styles.loading}` : `${styles.createTaskPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && (
				<form onSubmit={createTask} className={styles.form}>
					<label htmlFor="create-task" className={styles.label}>
						CREATE TASK
					</label>
					<input
						className={styles.input}
						id="create-task"
						name="create-task"
						type="text"
						autoFocus
						value={state.value}
						onChange={e => {
							dispatch({ type: 'initial-empty-state-change', payload: false });
							dispatch({ type: 'value-change', payload: e.target.value });
							dispatch({ type: 'status-change', payload: validateName(e.target.value) });
						}}
					/>
					<Message message={state.status.message} />
					<FormBtn text="CREATE" color="blue" />
				</form>
			)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default CreateTaskPage;
