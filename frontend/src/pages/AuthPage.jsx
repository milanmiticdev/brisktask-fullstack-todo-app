// React
import { useReducer, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import TabsToggle from './../components/TabsToggle.jsx';
import Tab from './../components/Tab.jsx';
import Form from './../components/Form.jsx';
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Spinner from './../components/Spinner.jsx';
import Modal from './../components/Modal.jsx';

// Utils
import authController from './../utils/controllers/auth.controller.js';
import validation from './../utils/validation.js';

// Styles
import styles from './AuthPage.module.css';

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
	section: 'login',
	loading: false,
	spinner: '',
	modal: {
		isOpen: false,
		error: false,
		message: '',
	},
};

const reducer = (state, action) => {
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

const AuthPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const { loginUser, registerUser } = authController;
	const { validateName, validateEmail, validatePassword } = validation;

	const handleLoginUser = async e => {
		await loginUser(e, state, dispatch, login, navigate);
	};

	const handleRegisterUser = async e => {
		await registerUser(e, state, dispatch, login, navigate);
	};

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.authPage}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.isOpen && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
				<TabsToggle>
					<Tab section={state.section} dispatch={dispatch} type="section-change" payload="login" position="left" text="LOGIN" />
					<Tab
						section={state.section}
						dispatch={dispatch}
						type="section-change"
						payload="register"
						position="right"
						text="REGISTER"
					/>
				</TabsToggle>
			)}
			{!state.loading && (
				<Form onSubmit={state.section === 'login' ? handleLoginUser : handleRegisterUser}>
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
					<FormBtn text={state.section === 'login' ? 'LOGIN' : 'REGISTER'} type="submit" color="blue" />
				</Form>
			)}
		</main>
	);
};

export default AuthPage;
