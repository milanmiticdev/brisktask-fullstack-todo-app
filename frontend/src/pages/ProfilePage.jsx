// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import Message from '../components/Message.jsx';

// Utils
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './ProfilePage.module.css';

// Initial reducer state
const initialState = {
	user: {},
	inputName: '',
	inputEmail: '',
	loading: false,
	error: false,
	isEditing: false,
	message: '',
	spinnerText: '',
	modal: {
		isOpen: false,
		error: true,
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
	}
};

const ProfilePage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { userId, userRole, token, login } = useContext(AuthContext);

	const navigate = useNavigate();

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
						dispatch({ type: 'loading-check', payload: true });
						dispatch({ type: 'spinner-text-change', payload: 'Logging' });
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

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.profile}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading && !state.error && state.user && (
				<div className={styles.info}>
					<button className={`${styles.btn} ${styles.edit}`} onClick={handleEditBtn}>
						EDIT
					</button>
					<form onSubmit={updateUser} className={styles.form}>
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
						{state.isEditing && (
							<div className={styles.submitBtns}>
								<button type="submit" className={`${styles.btn} ${styles.save}`}>
									SAVE
								</button>
								<button className={`${styles.btn} ${styles.cancel}`} onClick={handleCancelBtn}>
									CANCEL
								</button>
							</div>
						)}
					</form>
				</div>
			)}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default ProfilePage;
