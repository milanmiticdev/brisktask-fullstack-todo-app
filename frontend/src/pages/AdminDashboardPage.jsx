//React
import { useReducer } from 'react';

// Components
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import AdminActions from './../components/AdminActions.jsx';
import Table from './../components/Table.jsx';

// Styles
import styles from './AdminDashboardPage.module.css';

const initialState = {
	result: null,
	inputId: 0,
	inputName: '',
	inputEmail: '',
	inputPassword: '',
	isSelecting: false,
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
		case 'result-fetched':
			return { ...state, result: action.payload };
		case 'id-change':
			return { ...state, inputId: action.payload };
		case 'name-change':
			return { ...state, inputName: action.payload };
		case 'email-change':
			return { ...state, inputEmail: action.payload };
		case 'password-change':
			return { ...state, inputPassword: action.payload };
		case 'is-selecting':
			return { ...state, isSelecting: action.payload };
		case 'loading-check':
			return { ...state, loading: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AdminDashboardPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.dashboardPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
			{!state.loading && <AdminActions state={state} dispatch={dispatch} />}
			{!state.loading && state.result && state.result.length > 0 && <Table result={state.result} />}
		</main>
	);
};

export default AdminDashboardPage;
