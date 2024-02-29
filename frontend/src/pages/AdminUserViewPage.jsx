// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';

// Utils
import validation from '../utils/validation.js';
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './AdminUserViewPage.module.css';

// Initial reducer state
const initialState = {
	user: {},
	inputName: '',
	inputEmail: '',
	inputRole: '',
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
	editing: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state, action) => {
	switch (action.type) {
		case 'user-fetched':
			return { ...state, user: action.payload };
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'email-field-change':
			return { ...state, inputEmail: action.payload };
		case 'role-change':
			return { ...state, inputRole: action.payload };
		case 'password-field-change':
			return { ...state, password: action.payload };
		case 'password-status-change':
			return { ...state, passwordStatus: action.payload };
		case 'confirm-password-field-change':
			return { ...state, confirmPassword: action.payload };
		case 'confirm-password-status-change':
			return { ...state, confirmPasswordStatus: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'error-change':
			return { ...state, error: action.payload };
		case 'editing-change':
			return { ...state, editing: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AdminUserViewPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { userId } = useParams();
	const { token } = useContext(AuthContext);

	const navigate = useNavigate();
	const { validatePassword } = validation;

	const handleEditBtn = () => {
		dispatch({ type: 'editing-change', payload: true });
	};

	const handleCancelBtn = () => {
		dispatch({ type: 'editing-change', payload: false });
		dispatch({ type: 'name-change', payload: state.user.name });
		dispatch({ type: 'email-change', payload: state.user.email });
		dispatch({ type: 'role-change', payload: state.user.role });
	};

	useEffect(() => {
		const getUser = async () => {
			try {
				dispatch({ type: 'loading-change', payload: true });
				dispatch({ type: 'message-change', payload: '' });
				dispatch({ type: 'spinner-change', payload: 'Loading' });

				const response = await fetch(`http://localhost:5174/api/v1/users/${Number(userId)}`, {
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
					dispatch({ type: 'role-change', payload: data.user.role });
					dispatch({ type: 'message-change', payload: '' });
					dispatch({ type: 'spinner-change', payload: '' });
					dispatch({ type: 'error-change', payload: false });
					dispatch({ type: 'loading-change', payload: false });
				} else {
					dispatch({ type: 'message-change', payload: data.message });
					dispatch({ type: 'spinner-change', payload: '' });
					dispatch({ type: 'error-change', payload: true });
					dispatch({ type: 'loading-change', payload: false });
				}
			} catch {
				dispatch({ type: 'message-change', payload: 'Something went wrong.' });
				dispatch({ type: 'spinner-change', payload: '' });
				dispatch({ type: 'error-change', payload: true });
				dispatch({ type: 'loading-change', payload: false });
			}
		};
		getUser();
	}, [userId, token]);

	const updateUser = async e => {
		e.preventDefault();

		if (state.user.name === state.inputName && state.user.email === state.inputEmail && state.user.role === state.inputRole) {
			dispatch({ type: 'editing-change', payload: false });
		} else {
			const updatedUser = {
				name: state.inputName,
				email: state.inputEmail,
				role: state.inputRole,
			};

			try {
				dispatch({ type: 'loading-change', payload: true });
				dispatch({ type: 'spinner-change', payload: 'Updating' });

				const response = await fetch(`http://localhost:5174/api/v1/users/${Number(userId)}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(updatedUser),
				});
				const data = await response.json();

				if (data.status === 200) {
					navigate(0);
				} else {
					dispatch({ type: 'spinner-change', payload: '' });
					dispatch({ type: 'loading-change', payload: false });
					dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
				}
			} catch {
				dispatch({ type: 'spinner-change', payload: '' });
				dispatch({ type: 'loading-change', payload: false });
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
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
			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Updating' });

			const response = await fetch(`http://localhost:5174/api/v1/users/change-password/${Number(userId)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(changedPassword),
			});
			const data = await response.json();

			if (data.status === 200) {
				dispatch({ type: 'spinner-change', payload: '' });
				dispatch({ type: 'loading-change', payload: false });
				dispatch({ type: 'modal-change', payload: { open: true, error: false, message: data.message } });
			} else {
				dispatch({ type: 'spinner-change', payload: '' });
				dispatch({ type: 'loading-change', payload: false });
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'spinner-change', payload: '' });
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		}
	};

	const deleteUser = async () => {
		try {
			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Deleting' });

			const response = await fetch(`http://localhost:5174/api/v1/users/${Number(userId)}`, {
				method: 'DELETE',
				body: null,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 204) {
				navigate('/dashboard');
			} else {
				const data = await response.json();

				dispatch({ type: 'spinner-change', payload: '' });
				dispatch({ type: 'loading-change', payload: false });
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'spinner-change', payload: '' });
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		}
	};

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.profile}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.user && (
				<>
					<section className={styles.section}>
						<h2 className={styles.heading}>PROFILE INFO</h2>
						<form onSubmit={updateUser} className={styles.infoForm}>
							<div className={styles.block}>
								<label className={styles.label}>NAME</label>
								<input
									className={state.editing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputName}
									onChange={e => {
										dispatch({ type: 'name-change', payload: e.target.value });
									}}
									readOnly={state.editing ? false : true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>EMAIL</label>
								<input
									className={state.editing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputEmail}
									onChange={e => {
										dispatch({ type: 'email-change', payload: e.target.value });
									}}
									readOnly={state.editing ? false : true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>ROLE</label>
								<input
									className={state.editing ? `${styles.input}` : `${styles.input} ${styles.inputReadOnly}`}
									value={state.inputRole}
									onChange={e => {
										dispatch({ type: 'role-change', payload: e.target.value });
									}}
									readOnly={state.editing ? false : true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>CREATED</label>
								<input
									className={`${styles.input} ${styles.inputReadOnly}`}
									value={`${UTCtoLocal(state.user.createdAt).date} ${UTCtoLocal(state.user.createdAt).time}`}
									readOnly={true}
								/>
							</div>
							<div className={styles.block}>
								<label className={styles.label}>UPDATED</label>
								<input
									className={`${styles.input} ${styles.inputReadOnly}`}
									value={`${UTCtoLocal(state.user.updatedAt).date} ${UTCtoLocal(state.user.updatedAt).time}`}
									readOnly={true}
								/>
							</div>
							<div className={styles.infoFormBtns}>
								{!state.editing && <FormBtn text="EDIT" color="gray" onClick={handleEditBtn} />}
								{state.editing && (
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
		</main>
	);
};

export default AdminUserViewPage;
