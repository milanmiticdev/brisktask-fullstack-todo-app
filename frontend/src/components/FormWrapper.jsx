// React
import { useReducer } from 'react';

// Components
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import Spinner from './Spinner.jsx';
import Modal from './Modal.jsx';

// Styles
import styles from './FormWrapper.module.css';

const initialState = {
	toggleLogin: true,
	loading: false,
	spinnerText: '',
	modal: {
		isOpen: false,
		error: false,
		message: '',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'toggle-login':
			return { ...state, toggleLogin: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const Form = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<section className={state.loading ? `${styles.loading}` : `${styles.formWrapper}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && (
				<div className={styles.formToggle}>
					<div
						onClick={() => dispatch({ type: 'toggle-login', payload: true })}
						className={`${styles.toggleTab} ${styles.toggleTabLeft} ${state.toggleLogin && styles.activeTab}`}
					>
						LOGIN
					</div>
					<div
						onClick={() => dispatch({ type: 'toggle-login', payload: false })}
						className={`${styles.toggleTab} ${styles.toggleTabRight} ${!state.toggleLogin && styles.activeTab}`}
					>
						REGISTER
					</div>
				</div>
			)}
			{!state.loading &&
				(state.toggleLogin ? <LoginForm formWrapperDispatch={dispatch} /> : <RegisterForm formWrapperDispatch={dispatch} />)}
			{!state.loading && state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default Form;
