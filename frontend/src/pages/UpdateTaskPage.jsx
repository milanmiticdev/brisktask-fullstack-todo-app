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
import Message from './../components/Message.jsx';

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
	message: '',
	spinnerText: '',
	modal: {
		isOpen: false,
		error: false,
		message: '',
	},
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case 'result-fetched':
			return { ...state, result: action.payload };
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'is-loading':
			return { ...state, loading: action.payload };
		case 'is-error':
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

	useEffect(() => {
		dispatch({ type: 'name-field-change', payload: { value: state.result.name, error: false, message: '' } });
	}, [state.result]);

	const handleUpdateTaskById = async e => {
		await updateTaskById(e, taskId, token, userRole, navigate, dispatch);
	};

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.updateTaskPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading && !state.error && (
				<Form onSubmit={handleUpdateTaskById}>
					<FormField
						field="name"
						type="text"
						onValidate={validateName}
						onDispatch={dispatch}
						message={state.nameField.message}
						fieldChange="name-field-change"
					/>
					<FormBtn text="UPDATE" color="blue" />
				</Form>
			)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default UpdateTaskPage;
