// React
import { useReducer, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import FormField from './FormField.jsx';
import FormBtn from './FormBtn.jsx';

// Utils
import authController from './../utils/controllers/auth.controller.js';
import validation from '../utils/validation.js';

// Styles
import styles from './LoginForm.module.css';

// PropTypes
import PropTypes from 'prop-types';

const initialState = {
	email: '',
	emailStatus: {
		error: true,
		message: '',
	},
	password: '',
	passwordStatus: {
		error: true,
		message: '',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'email-field-change':
			return { ...state, email: action.payload };
		case 'email-status-change':
			return { ...state, emailStatus: action.payload };
		case 'password-field-change':
			return { ...state, password: action.payload };
		case 'password-status-change':
			return { ...state, passwordStatus: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
	}
};

const LoginForm = ({ formWrapperDispatch }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const { loginUser } = authController;
	const { validateEmail, validatePassword } = validation;

	const handleLogin = async e => {
		await loginUser(e, state, dispatch, login, navigate);
	};

	return (
		<form onSubmit={handleLogin} className={styles.form}>
			<FormField
				htmlFor="email"
				type="text"
				id="email"
				name="email"
				fieldChange="email-field-change"
				statusChangeType="email-status-change"
				onValidate={validateEmail}
				onDispatch={dispatch}
				message={state.emailStatus.message}
			/>
			<FormField
				htmlFor="password"
				type="password"
				id="password"
				name="password"
				fieldChange="password-field-change"
				onValidate={validatePassword}
				onDispatch={dispatch}
				message={state.passwordStatus.message}
			/>
			<FormBtn text="LOGIN" color="blue" />
		</form>
	);
};

export default LoginForm;

LoginForm.propTypes = {
	formWrapperDispatch: PropTypes.func,
};
