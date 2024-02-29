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
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'is-loading':
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
	const navigate = useNavigate();

	const { createTask } = taskController;
	const { validateName } = validation;

	const handleCreateTask = async e => {
		await createTask(e, userId, token, state, dispatch, navigate);
	};

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.createTaskPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && (
				<Form onSubmit={handleCreateTask}>
					<FormField
						field="name"
						type="text"
						onValidate={validateName}
						onDispatch={dispatch}
						message={state.nameField.message}
						fieldChange="name-field-change"
					/>
					<FormBtn text="CREATE" color="blue" />
				</Form>
			)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default CreateTaskPage;
