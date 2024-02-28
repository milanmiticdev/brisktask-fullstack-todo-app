//React
import { useReducer, useEffect } from 'react';

// Components
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';
import TabsToggle from './../components/TabsToggle.jsx';
import Tab from './../components/Tab.jsx';
import AdminActions from './../components/AdminActions.jsx';
import Table from './../components/Table.jsx';

// Styles
import styles from './AdminDashboardPage.module.css';

const initialState = {
	result: [],
	category: 'users',
	isSelecting: false,
	showTable: false,
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
		case 'category-change':
			return { ...state, category: action.payload };
		case 'is-selecting':
			return { ...state, isSelecting: action.payload };
		case 'show-table':
			return { ...state, showTable: action.payload };
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

	useEffect(() => {
		dispatch({ type: 'is-selecting', payload: false });
		dispatch({ type: 'show-table', payload: false });
	}, [state.category]);

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.dashboardPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
			{!state.loading && (
				<section className={styles.operations}>
					<TabsToggle>
						<Tab
							category={state.category}
							dispatch={dispatch}
							type="category-change"
							payload="users"
							position="left"
							text="USERS"
						/>
						<Tab
							category={state.category}
							dispatch={dispatch}
							type="category-change"
							payload="tasks"
							position="right"
							text="TASKS"
						/>
					</TabsToggle>
					<AdminActions category={state.category} isSelecting={state.isSelecting} dispatch={dispatch} />
				</section>
			)}
			{!state.loading && state.showTable && state.result.length > 0 && <Table category={state.category} result={state.result} />}
		</main>
	);
};

export default AdminDashboardPage;
