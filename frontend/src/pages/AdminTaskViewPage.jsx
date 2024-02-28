// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import Message from '../components/Message.jsx';

// Utils
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './AdminTaskViewPage.module.css';

// Initial reducer state
const initialState = {
	task: {},
	inputName: '',
	loading: false,
	error: false,
	isEditing: false,
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
		case 'task-fetched':
			return { ...state, task: action.payload };
		case 'name-change':
			return { ...state, inputName: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'error-check':
			return { ...state, error: action.payload };
		case 'is-editing':
			return { ...state, isEditing: action.payload };
		case 'message-change':
			return { ...state, message: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
		case 'window-resize':
			return { ...state, windowSize: action.payload };
	}
};

const AdminTaskViewPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { taskId } = useParams();
	const { token } = useContext(AuthContext);

	const navigate = useNavigate();

	const handleEditBtn = () => {
		dispatch({ type: 'is-editing', payload: true });
	};

	const handleCancelBtn = () => {
		dispatch({ type: 'is-editing', payload: false });
		dispatch({ type: 'name-change', payload: state.task.name });
	};

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
					dispatch({ type: 'task-fetched', payload: data.task });
					dispatch({ type: 'name-change', payload: data.task.name });
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

		if (state.task.name === state.inputName) {
			dispatch({ type: 'is-editing', payload: false });
		} else {
			const updatedTask = {
				name: state.inputName,
			};

			try {
				dispatch({ type: 'loading-check', payload: true });
				dispatch({ type: 'spinner-text-change', payload: 'Updating' });

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
					navigate(0);
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
		}
	};

	const deleteTask = async () => {
		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Deleting' });

			const response = await fetch(`http://localhost:5174/api/v1/tasks/${Number(taskId)}`, {
				method: 'DELETE',
				body: null,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 204) {
				navigate('/dashboard');
			} else {
				const data = await response.json();

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
		<main className={state.loading ? `${styles.loading}` : `${styles.taskViewPage}`}>
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading && !state.error && state.task && (
				<>
					<section className={styles.section}>
						<h2 className={styles.heading}>TASK INFO</h2>
						<form onSubmit={updateTask} className={styles.infoForm}>
							<div className={styles.block}>
								<label className={styles.label}>NAME</label>
								<input
									className={state.isEditing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputName}
									onChange={e => {
										dispatch({ type: 'name-change', payload: e.target.value });
									}}
									readOnly={state.isEditing ? false : true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>CREATOR</label>
								<input className={`${styles.input} ${styles.inputReadOnly}`} value={state.task.userEmail} readOnly={true} />
							</div>
							<div className={styles.block}>
								<label className={styles.label}>CREATED</label>
								<input
									className={`${styles.input} ${styles.inputReadOnly}`}
									value={`${UTCtoLocal(state.task.createdAt).date} ${UTCtoLocal(state.task.createdAt).time}`}
									readOnly={true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>UPDATED</label>
								<input
									className={`${styles.input} ${styles.inputReadOnly}`}
									value={`${UTCtoLocal(state.task.updatedAt).date} ${UTCtoLocal(state.task.updatedAt).time}`}
									readOnly={true}
								/>
							</div>
							<div className={styles.infoFormBtns}>
								{!state.isEditing && <FormBtn text="EDIT" color="gray" onClick={handleEditBtn} />}
								{state.isEditing && (
									<>
										<FormBtn text="SAVE" color="blue" />
										<FormBtn text="X" color="red" onClick={handleCancelBtn} />
									</>
								)}
							</div>
						</form>
					</section>
					<section className={styles.section}>
						<h2 className={styles.heading}>DELETE TASK</h2>
						<FormBtn text="DELETE" color="red" onClick={deleteTask} />
					</section>
				</>
			)}
		</main>
	);
};

export default AdminTaskViewPage;
