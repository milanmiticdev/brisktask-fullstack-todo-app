// React
import { useReducer, useContext } from 'react';

// Contenxt
import AuthContext from './../../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import Button from './../../components/shared/Button.jsx';
import Form from './../../components/shared/Form.jsx';
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
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	loading: false,
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
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const CreateTask = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { createTask } = taskController;
	const { validateName } = validators;

	const handleCreateTask = async e => await createTask(userId, token, state, dispatch, navigate, e);

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && (
				<Form onSubmit={handleCreateTask} heading="CREATE TASK">
					<FormField
						name="name"
						type="text"
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={true}
					/>
					<Button text="CREATE" type="submit" color="blue" />
				</Form>
			)}
		</Page>
	);
};

export default CreateTask;
