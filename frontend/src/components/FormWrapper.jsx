// React
import { useReducer } from 'react';

// Components
import TabsToggle from './TabsToggle.jsx';
import Tab from './Tab.jsx';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import Spinner from './Spinner.jsx';
import Modal from './Modal.jsx';

// Styles
import styles from './FormWrapper.module.css';

const initialState = {
	category: 'login',
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
		case 'category-change':
			return { ...state, category: action.payload };
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
				<TabsToggle>
					<Tab
						category={state.category}
						dispatch={dispatch}
						type="category-change"
						payload="login"
						position="left"
						text="LOGIN"
					/>
					<Tab
						category={state.category}
						dispatch={dispatch}
						type="category-change"
						payload="register"
						position="right"
						text="REGISTER"
					/>
				</TabsToggle>
			)}
			{!state.loading &&
				(state.category === 'login' ? (
					<LoginForm formWrapperDispatch={dispatch} />
				) : (
					<RegisterForm formWrapperDispatch={dispatch} />
				))}
			{!state.loading && state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
		</section>
	);
};

export default Form;
