// React
import { useReducer, useEffect, useContext } from 'react';

// Context
import AuthContext from './../../contexts/AuthContext.js';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Form from './../../components/shared/Form.jsx';
import FormBtn from './../../components/shared/FormBtn.jsx';
import FormField from './../../components/shared/FormField.jsx';
import Modal from './../../components/shared/Modal.jsx';
import Page from './../../components/shared/Page.jsx';
import Spinner from './../../components/shared/Spinner.jsx';

// Controllers
import taskController from './../../controllers/task.controller.js';

// Utils
import validators from './../../utils/validators.js';

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
	const { validateName } = validators;

	useEffect(() => {
		const handleGetTaskById = async e => await getTaskById(taskId, token, dispatch, e);
		handleGetTaskById();
	}, [taskId, token, getTaskById]);

	const handleUpdateTaskById = async e => await updateTaskById(taskId, userRole, token, state, dispatch, navigate, e);

	return (
		<Page loading={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && Object.keys(state.result).length > 0 && (
				<Form onSubmit={handleUpdateTaskById} heading="UPDATE TASK">
					<FormField
						name="name"
						type="text"
						initial={state.result.name}
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={true}
					/>
					<FormBtn text="UPDATE" type="submit" color="blue" />
				</Form>
			)}
		</Page>
	);
};

export default UpdateTaskPage;
