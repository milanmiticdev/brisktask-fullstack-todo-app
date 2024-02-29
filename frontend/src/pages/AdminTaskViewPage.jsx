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

// Utils
import taskController from './../utils/controllers/task.controller.js';
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './AdminTaskViewPage.module.css';

// Initial reducer state
const initialState = {
	result: {},
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	loading: false,
	error: false,
	editing: false,
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
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'error-change':
			return { ...state, error: action.payload };
		case 'editing-change':
			return { ...state, editing: action.payload };
		case 'message-change':
			return { ...state, message: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AdminTaskViewPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { taskId } = useParams();
	const { token } = useContext(AuthContext);

	const navigate = useNavigate();

	const { getTaskById, updateTaskById, deleteTaskById } = taskController;

	const handleEditBtn = () => {
		dispatch({ type: 'editing-change', payload: true });
	};

	const handleCancelBtn = () => {
		dispatch({ type: 'editing-change', payload: false });
		dispatch({ type: 'name-change', payload: state.task.name });
	};

	const handleUpdateTaskById = async e => {
		await updateTaskById(e, taskId, token, state, dispatch, navigate);
	};

	const handleDeleteTaskById = async () => {
		await deleteTaskById(taskId, token, dispatch, navigate);
	};

	useEffect(() => {
		const handleGetTaskById = async () => {
			await getTaskById(taskId, token, dispatch);
		};
		handleGetTaskById();
	}, [taskId, token, dispatch, getTaskById]);

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.taskViewPage}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && (
				<>
					<section className={styles.section}>
						<h2 className={styles.heading}>TASK INFO</h2>
						<form onSubmit={handleUpdateTaskById} className={styles.infoForm}>
							<div className={styles.block}>
								<label className={styles.label}>NAME</label>
								<input
									className={state.editing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputName}
									onChange={e => {
										dispatch({ type: 'name-change', payload: e.target.value });
									}}
									readOnly={state.editing ? false : true}
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
								{!state.editing && <FormBtn text="EDIT" color="gray" onClick={handleEditBtn} />}
								{state.editing && (
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
						<FormBtn text="DELETE" color="red" onClick={handleDeleteTaskById} />
					</section>
				</>
			)}
		</main>
	);
};

export default AdminTaskViewPage;
