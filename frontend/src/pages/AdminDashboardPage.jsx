//React
import { useReducer } from 'react';

// Components
import AdminActions from './../components/AdminActions.jsx';
import Table from './../components/Table.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';

// Styles
import styles from './AdminDashboardPage.module.css';

const initialState = {
	result: null,
	loading: false,
	spinnerText: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'result-fetched':
			return { ...state, result: action.payload };
		case 'is-loading':
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
			{state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && <AdminActions onDispatch={dispatch} />}
			{!state.loading && state.result && <Table result={state.result} />}
		</main>
	);
};

export default AdminDashboardPage;
