// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import Form from './../components/Form.jsx';
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';

// Controllers
import taskController from './../controllers/task.controller.js';

// Utils
import validators from '../utils/validators.js';
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
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AdminTaskViewPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userRole, token } = useContext(AuthContext);
	const { taskId } = useParams();
	const navigate = useNavigate();

	const { getTaskById, updateTaskById, deleteTaskById } = taskController;
	const { validateName } = validators;

	const handleEditBtn = () => dispatch({ type: 'editing-change', payload: true });
	const handleCancelBtn = () => dispatch({ type: 'editing-change', payload: false });
	const handleUpdateTaskById = async e => await updateTaskById(taskId, userRole, token, state, dispatch, navigate, e);
	const handleDeleteTaskById = async e => await deleteTaskById(taskId, userRole, token, dispatch, navigate, e);

	useEffect(() => {
		const handleGetTaskById = async () => await getTaskById(taskId, token, dispatch);
		handleGetTaskById();
	}, [taskId, token, dispatch, getTaskById]);

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.task}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && (
				<>
					<section className={styles.section}>
						<Form onSubmit={handleUpdateTaskById}>
							<h2 className={styles.heading}>TASK INFO</h2>
							<FormField
								name="name"
								type="text"
								initial={state.result.name}
								fieldChange="name-field-change"
								onDispatch={dispatch}
								onValidate={validateName}
								readOnly={state.editing ? false : true}
								autoFocus={false}
							/>
							<FormField name="creator" type="text" initial={state.result.userEmail} readOnly={true} autoFocus={false} />
							<FormField
								name="created"
								type="text"
								initial={`${UTCtoLocal(state.result.createdAt).date} ${UTCtoLocal(state.result.createdAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							<FormField
								name="updated"
								type="text"
								initial={`${UTCtoLocal(state.result.updatedAt).date} ${UTCtoLocal(state.result.updatedAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							<div className={styles.formBtns}>
								{!state.editing && <FormBtn text="EDIT" type="button" color="gray" onClick={handleEditBtn} />}
								{state.editing && (
									<>
										<FormBtn text="SAVE" type="submit" color="blue" />
										<FormBtn text="X" type="button" color="red" onClick={handleCancelBtn} />
									</>
								)}
							</div>
						</Form>
					</section>
					<section className={styles.section}>
						<Form onSubmit={handleDeleteTaskById}>
							<h2 className={styles.heading}>DELETE TASK</h2>
							<FormBtn text="DELETE" type="submit" color="red" />
						</Form>
					</section>
				</>
			)}
		</main>
	);
};

export default AdminTaskViewPage;
