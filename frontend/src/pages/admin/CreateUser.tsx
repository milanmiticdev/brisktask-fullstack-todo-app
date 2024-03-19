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
import userController from '../../controllers/user.controller';

// Utils
import validators from '../../utils/validators';

// Types
import type { CreateUserPageState, CreateUserPageAction } from './../../types/page.types';

// Initial reducer state
const initialState = {
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	emailField: {
		value: '',
		error: false,
		message: '',
	},
	passwordField: {
		value: '',
		error: false,
		message: '',
	},
	roleField: {
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

// Reducr function
const reducer = (state: CreateUserPageState, action: CreateUserPageAction): CreateUserPageState => {
	switch (action.type) {
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'email-field-change':
			return { ...state, emailField: action.payload };
		case 'password-field-change':
			return { ...state, passwordField: action.payload };
		case 'role-field-change':
			return { ...state, roleField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const CreateUser = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { createUser } = userController;
	const { validateName, validateEmail, validatePassword, validateRole } = validators;

	const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => await createUser({ token, state, dispatch, navigate, e });

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
				<Form onSubmit={handleCreateUser} heading="CREATE USER">
					<FormField
						name="name"
						type="text"
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="email"
						type="text"
						fieldChange="email-field-change"
						onDispatch={dispatch}
						onValidate={validateEmail}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="password"
						type="password"
						fieldChange="password-field-change"
						onDispatch={dispatch}
						onValidate={validatePassword}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="role"
						type="text"
						fieldChange="role-field-change"
						onDispatch={dispatch}
						onValidate={validateRole}
						readOnly={false}
						autoFocus={false}
					/>
					<Button text="CREATE" type="submit" color="blue" />
				</Form>
			)}
		</Page>
	);
};

export default CreateUser;
