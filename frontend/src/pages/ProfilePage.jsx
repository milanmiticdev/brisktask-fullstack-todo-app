// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import Spinner from '../components/Spinner.jsx';
import Message from '../components/Message.jsx';

// Utils
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './ProfilePage.module.css';

// Initial reducer state
const initialState = {
	user: {},
	loading: false,
	error: false,
	message: '',
	spinnerText: '',
};

// Reducr function
const reducer = (state, action) => {
	switch (action.type) {
		case 'user-fetched':
			return { ...state, user: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'error-check':
			return { ...state, error: action.payload };
		case 'message-change':
			return { ...state, message: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
	}
};

const ProfilePage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { userId, token, logout } = useContext(AuthContext);

	const navigate = useNavigate();

	const local = UTCtoLocal(state.user.createdAt);

	const handleLogout = () => {
		logout();
		navigate('/');
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

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.profile}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.error && <Message message={state.message} />}
			{!state.loading && !state.error && state.user && (
				<div className={styles.info}>
					<p>
						<span className={styles.span}>NAME:</span> {state.user.name}
					</p>
					<p>
						<span className={styles.span}>EMAIL:</span> {state.user.email}
					</p>
					<p>
						<span className={styles.span}>ROLE:</span> {state.user.role}
					</p>
					<p>
						<span className={styles.span}>REGISTERED:</span> {`${local.date} ${local.time}`}
					</p>
					<button className={styles.logout} onClick={handleLogout}>
						LOGOUT
					</button>
				</div>
			)}
		</section>
	);
};

export default ProfilePage;
