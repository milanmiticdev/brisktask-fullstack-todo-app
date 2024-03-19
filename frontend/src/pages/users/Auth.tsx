// React
import { useReducer, useContext, FormEvent } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../../contexts/AuthContext';

// Components
import Button from './../../components/shared/Button';
import Form from './../../components/shared/Form';
import FormField from './../../components/shared/FormField';
import Modal from './../../components/shared/Modal';
import Page from './../../components/shared/Page';
import Spinner from './../../components/shared/Spinner';
import TabsToggle from './../../components/users/TabsToggle';
import Tab from './../../components/users/Tab';

// Controllers
import authController from '../../controllers/auth.controller';

// Utils
import validators from '../../utils/validators';

// Types
import type { AuthPageState, AuthPageAction } from './../../types/page.types';

const initialState: AuthPageState = {
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
	section: 'login',
	loading: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

const reducer = (state: AuthPageState, action: AuthPageAction): AuthPageState => {
	switch (action.type) {
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'email-field-change':
			return { ...state, emailField: action.payload };
		case 'password-field-change':
			return { ...state, passwordField: action.payload };
		case 'section-change':
			return { ...state, section: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AuthPage = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const { authenticateUser } = authController;
	const { validateName, validateEmail, validatePassword } = validators;

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		const route = state.section === 'login' ? 'login' : 'register';
		await authenticateUser({ route, state, dispatch, navigate, login, e });
	};

	return (
		<Page center={true}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
				<TabsToggle>
					<Tab section={state.section} onDispatch={dispatch} type="section-change" payload="login" position="left" text="LOGIN" />
					<Tab
						section={state.section}
						onDispatch={dispatch}
						type="section-change"
						payload="register"
						position="right"
						text="REGISTER"
					/>
				</TabsToggle>
			)}
			{!state.loading && (
				<Form onSubmit={handleSubmit}>
					{state.section === 'register' && (
						<FormField
							name="name"
							type="text"
							fieldChange="name-field-change"
							onDispatch={dispatch}
							onValidate={validateName}
							section={state.section}
							readOnly={false}
							autoFocus={false}
						/>
					)}
					<FormField
						name="email"
						type="text"
						fieldChange="email-field-change"
						onDispatch={dispatch}
						onValidate={validateEmail}
						section={state.section}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="password"
						type="password"
						fieldChange="password-field-change"
						onDispatch={dispatch}
						onValidate={validatePassword}
						section={state.section}
						readOnly={false}
						autoFocus={false}
					/>
					<Button text={state.section === 'login' ? 'LOGIN' : 'REGISTER'} type="submit" color="blue" />
				</Form>
			)}
		</Page>
	);
};

export default AuthPage;
