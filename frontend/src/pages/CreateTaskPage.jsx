// React
import { useReducer, useContext } from 'react';

// Contenxt
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

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
import styles from './CreateTaskPage.module.css';

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
		error: true,
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

const CreateTaskPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { createTask } = taskController;
	const { validateName } = validation;

	const handleCreateTask = async e => {
		await createTask(e, userId, token, state, dispatch, navigate);
	};

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.createTaskPage}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
				<Form onSubmit={handleCreateTask}>
					<FormField
						name="name"
						type="text"
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={true}
					/>
					<FormBtn text="CREATE" type="submit" color="blue" />
				</Form>
			)}
		</section>
	);
};

export default CreateTaskPage;
