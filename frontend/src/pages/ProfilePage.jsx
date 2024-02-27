// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import Message from '../components/Message.jsx';

// Utils
import validation from '../utils/validation.js';
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './ProfilePage.module.css';

// Initial reducer state
const initialState = {
	user: {},
	inputName: '',
	inputEmail: '',
	password: '',
	passwordStatus: {
		error: false,
		message: '',
	},
	confirmPassword: '',
	confirmPasswordStatus: {
		error: false,
		message: '',
	},
	loading: false,
	error: false,
	isEditing: false,
	message: '',
	spinnerText: '',
	modal: {
		isOpen: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state, action) => {
	switch (action.type) {
		case 'user-fetched':
			return { ...state, user: action.payload };
		case 'name-change':
			return { ...state, inputName: action.payload };
		case 'email-change':
			return { ...state, inputEmail: action.payload };
		case 'password-field-change':
			return { ...state, password: action.payload };
		case 'password-status-change':
			return { ...state, passwordStatus: action.payload };
		case 'confirm-password-field-change':
			return { ...state, confirmPassword: action.payload };
		case 'confirm-password-status-change':
			return { ...state, confirmPasswordStatus: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'error-check':
			return { ...state, error: action.payload };
		case 'is-editing':
			return { ...state, isEditing: action.payload };
		case 'message-change':
			return { ...state, message: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const ProfilePage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { userId, userRole, token, login, logout } = useContext(AuthContext);

	const navigate = useNavigate();
	const { validatePassword } = validation;

	const handleEditBtn = () => {
		dispatch({ type: 'is-editing', payload: true });
	};

	const handleCancelBtn = () => {
		dispatch({ type: 'is-editing', payload: false });
		dispatch({ type: 'name-change', payload: state.user.name });
		dispatch({ type: 'email-change', payload: state.user.email });
	};

	useEffect(() => {
		const getUser = async () => {
			try {
				dispatch({ type: 'loading-check', payload: true });
				dispatch({ type: 'message-change', payload: '' });
				dispatch({ type: 'spinner-text-change', payload: 'Loading' });

				const response = await fetch(`http://localhost:5174/api/v1/users/${userId}`, {
					method: 'GET',
					body: null,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();

				if (data.status === 200) {
					dispatch({ type: 'user-fetched', payload: data.user });
					dispatch({ type: 'name-change', payload: data.user.name });
					dispatch({ type: 'email-change', payload: data.user.email });
					dispatch({ type: 'message-change', payload: '' });
					dispatch({ type: 'spinner-text-change', payload: '' });
					dispatch({ type: 'error-check', payload: false });
					dispatch({ type: 'loading-check', payload: false });
				} else {
					dispatch({ type: 'message-change', payload: data.message });
					dispatch({ type: 'spinner-text-change', payload: '' });
					dispatch({ type: 'error-check', payload: true });
					dispatch({ type: 'loading-check', payload: false });
				}
			} catch {
				dispatch({ type: 'message-change', payload: 'Something went wrong.' });
				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'error-check', payload: true });
				dispatch({ type: 'loading-check', payload: false });
			}
		};
		getUser();
	}, [userId, token]);

	const updateUser = async e => {
		e.preventDefault();

		if (state.user.name === state.inputName && state.user.email === state.inputEmail) {
			dispatch({ type: 'is-editing', payload: false });
		} else {
			const updatedUser = {
				name: state.inputName,
				email: state.inputEmail,
			};

			try {
				dispatch({ type: 'loading-check', payload: true });
				dispatch({ type: 'spinner-text-change', payload: 'Updating' });

				const response = await fetch(`http://localhost:5174/api/v1/users/${userId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(updatedUser),
				});
				const data = await response.json();

				if (data.status === 200) {
					// If the email doesn't change there is no need to recreate token and login again
					if (state.user.email === state.inputEmail) {
						navigate(0);
					} else {
						login(userId, userRole, data.token);
						navigate(0);
					}
				} else {
					dispatch({ type: 'spinner-text-change', payload: '' });
					dispatch({ type: 'loading-check', payload: false });
					dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
				}
			} catch {
				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'loading-check', payload: false });
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
			}
		}
	};

	const changePassword = async e => {
		e.preventDefault();

		const changedPassword = {
			password: state.password,
			confirmPassword: state.confirmPassword,
		};

		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Updating' });

			const response = await fetch(`http://localhost:5174/api/v1/users/change-password/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(changedPassword),
			});
			const data = await response.json();

			if (data.status === 200) {
				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'loading-check', payload: false });
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: false, message: data.message } });
			} else {
				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'loading-check', payload: false });
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'loading-check', payload: false });
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		}
	};

	const deleteUser = async () => {
		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Deleting' });

			const response = await fetch(`http://localhost:5174/api/v1/users/${userId}`, {
				method: 'DELETE',
				body: null,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 204) {
				logout();
				navigate('/');
			} else {
				const data = await response.json();

				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'loading-check', payload: false });
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'loading-check', payload: false });
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		}
	};

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.profile}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading && !state.error && state.user && (
				<>
					<section className={styles.section}>
						<h2 className={styles.heading}>PROFILE INFO</h2>
						<form onSubmit={updateUser} className={styles.infoForm}>
							<div className={styles.block}>
								<label className={styles.label}>NAME</label>
								<input
									className={state.isEditing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputName}
									onChange={e => {
										dispatch({ type: 'name-change', payload: e.target.value });
									}}
									readOnly={state.isEditing ? false : true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>EMAIL</label>
								<input
									className={state.isEditing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputEmail}
									onChange={e => {
										dispatch({ type: 'email-change', payload: e.target.value });
									}}
									readOnly={state.isEditing ? false : true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>ROLE</label>
								<input className={`${styles.input} ${styles.inputReadOnly}`} value={state.user.role} readOnly={true} />
							</div>
							<div className={styles.block}>
								<label className={styles.label}>CREATED</label>
								<input
									className={`${styles.input} ${styles.inputReadOnly}`}
									value={`${UTCtoLocal(state.user.createdAt).date} ${UTCtoLocal(state.user.createdAt).time}`}
									readOnly={true}
								/>
							</div>
							<div className={styles.infoFormBtns}>
								{!state.isEditing && <FormBtn text="EDIT" color="gray" onClick={handleEditBtn} />}
								{state.isEditing && (
									<>
										<FormBtn text="SAVE" color="blue" />
										<FormBtn text="X" color="red" onClick={handleCancelBtn} />
									</>
								)}
							</div>
						</form>
					</section>
					<section className={styles.section}>
						<h2 className={styles.heading}>CHANGE PASSWORD</h2>
						<form onSubmit={changePassword} className={styles.passwordForm}>
							<FormField
								htmlFor="password"
								type="password"
								id="password"
								name="new password"
								fieldChangeType="password-field-change"
								statusChangeType="password-status-change"
								onValidate={validatePassword}
								onDispatch={dispatch}
								message={state.passwordStatus.message}
							/>
							<FormField
								htmlFor="confirm-password"
								type="password"
								id="confirm-password"
								name="confirm password"
								fieldChangeType="confirm-password-field-change"
								statusChangeType="confirm-password-status-change"
								onValidate={validatePassword}
								onDispatch={dispatch}
								message={state.confirmPasswordStatus.message}
							/>
							<FormBtn text="CHANGE" color="blue" onClick={changePassword} />
						</form>
					</section>
					<section className={styles.section}>
						<h2 className={styles.heading}>DELETE ACCOUNT</h2>
						<FormBtn text="DELETE" color="red" onClick={deleteUser} />
					</section>
				</>
			)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</main>
	);
};

export default ProfilePage;
