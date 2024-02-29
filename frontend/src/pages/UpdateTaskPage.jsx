// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Form from './../components/Form.jsx';
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';

// Utils
import taskController from './../utils/controllers/task.controller.js';
import validation from './../utils/validation.js';

// Styles
import styles from './UpdateTaskPage.module.css';

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
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducer function
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
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const UpdateTaskPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { token, userRole } = useContext(AuthContext);
	const { taskId } = useParams();
	const navigate = useNavigate();

	const { getTaskById, updateTaskById } = taskController;
	const { validateName } = validation;

	useEffect(() => {
		const handleGetTaskById = async () => {
			await getTaskById(taskId, token, dispatch);
		};
		handleGetTaskById();
	}, [taskId, token, getTaskById]);

	const handleUpdateTaskById = async e => {
		await updateTaskById(e, taskId, token, userRole, navigate, dispatch, state);
	};

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.updateTaskPage}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && Object.keys(state.result).length > 0 && (
				<Form onSubmit={handleUpdateTaskById}>
					<FormField
						name="name"
						type="text"
						initial={state.result.name}
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={false}
					/>
					<FormBtn text="UPDATE" type="submit" color="blue" />
				</Form>
			)}
		</section>
	);
};

export default UpdateTaskPage;
