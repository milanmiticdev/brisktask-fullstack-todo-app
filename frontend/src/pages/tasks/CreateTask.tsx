// React
import { useReducer, useContext, FormEvent } from 'react';

// Contenxt
import AuthContext from '../../contexts/AuthContext';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import Button from '../../components/shared/Button';
import Form from '../../components/shared/Form';
import FormField from '../../components/shared/FormField';
import Modal from '../../components/shared/Modal';
import Page from '../../components/shared/Page';
import Spinner from '../../components/shared/Spinner';

// Controllers
import taskController from '../../controllers/task.controller';

// Utils
import validators from '../../utils/validators';

// Types
import type { CreateTaskPageState, CreateTaskPageAction } from './../../types/page.types';

// Initial reducer state
const initialState: CreateTaskPageState = {
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
const reducer = (state: CreateTaskPageState, action: CreateTaskPageAction): CreateTaskPageState => {
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

const CreateTask = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { createTask } = taskController;
	const { validateName } = validators;

	const handleCreateTask = async (e: FormEvent<HTMLFormElement>) => await createTask({ userId, token, state, dispatch, navigate, e });

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
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
