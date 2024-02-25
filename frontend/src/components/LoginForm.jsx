// React
import { useReducer, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import FormField from './FormField.jsx';
import Spinner from './Spinner.jsx';

// Utils
import validation from '../utils/validation.js';

// Styles
import styles from './LoginForm.module.css';

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
	const { validateEmail, validatePassword } = validation;

	const handleLogin = async e => {
		e.preventDefault();

		const user = {
			email: state.email,
			password: state.password,
		};

		try {
			formWrapperDispatch({ type: 'loading-check', payload: true });
			formWrapperDispatch({ type: 'spinner-text-change', payload: 'Login' });

			const response = await fetch('http://localhost:5174/api/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			});
			const data = await response.json();

			if (data.status === 200) {
				login(data.user.id, data.user.role, data.token);
				navigate('/');
			} else {
				formWrapperDispatch({ type: 'spinner-text-change', payload: '' });
				formWrapperDispatch({ type: 'loading-check', payload: false });
				formWrapperDispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
			}
		} catch {
			formWrapperDispatch({ type: 'spinner-text-change', payload: '' });
			formWrapperDispatch({ type: 'loading-check', payload: false });
			formWrapperDispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		}
	};

	return (
		<form onSubmit={handleLogin} className={styles.form}>
			<FormField
				htmlFor="email"
				type="text"
				id="email"
				name="email"
				fieldChange="email-field-change"
				statusChange="email-status-change"
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
				statusChange="password-status-change"
				onValidate={validatePassword}
				onDispatch={dispatch}
				message={state.passwordStatus.message}
			/>
			<button type="submit" className={styles.formSubmit}>
				LOGIN
			</button>
		</form>
	);
};

export default LoginForm;
