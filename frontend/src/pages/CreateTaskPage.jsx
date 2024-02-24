// React
import { useState, useReducer, useContext } from 'react';

// Contenxt
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import Modal from './../components/Modal.jsx';
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
	}
};

const CreateTaskPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [modal, setModal] = useState({
		isOpen: false,
		error: true,
		message: '',
	});

	const { userId, token } = useContext(AuthContext);
	const { validateName } = validation;
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();

		try {
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
				setModal({
					isOpen: true,
					error: true,
					message: data.message,
				});
			}
		} catch {
			setModal({
				isOpen: true,
				error: true,
				message: 'Something went wrong.',
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			{modal.isOpen && <Modal modal={modal} setModal={setModal} />}
			<label htmlFor="new-task" className={styles.label}>
				NEW TASK
			</label>
			<input
				className={styles.input}
				id="new-task"
				name="new-task"
				type="text"
				value={state.value}
				onChange={e => {
					dispatch({ type: 'value-change', payload: e.target.value });
					dispatch({ type: 'status-change', payload: validateName(e.target.value) });
					dispatch({ type: 'initial-empty-state-change', payload: false });
				}}
			/>
			<Message message={state.status.message} />
			<button className={styles.createBtn} type="submit">
				CREATE
			</button>
		</form>
	);
};

export default CreateTaskPage;
