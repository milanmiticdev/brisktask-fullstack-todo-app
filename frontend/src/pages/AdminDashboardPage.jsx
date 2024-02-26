//React
import { useReducer } from 'react';

// Components
import TabsToggle from './../components/TabsToggle.jsx';
import Tab from './../components/Tab.jsx';
import AdminOperationsUsers from './../components/AdminOperationsUsers.jsx';
import AdminOperationsTasks from './../components/AdminOperationsTasks.jsx';

// Styles
import styles from './AdminDashboardPage.module.css';

const initialState = {
	activeTab: 'users',
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'active-tab-change':
			return { ...state, activeTab: action.payload };
	}
};

const AdminDashboardPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<main className={styles.dashboardPage}>
			<section className={styles.operations}>
				<TabsToggle>
					<Tab
						activeTab={state.activeTab}
						dispatch={dispatch}
						type="active-tab-change"
						payload="users"
						position="left"
						text="USERS"
					/>
					<Tab
						activeTab={state.activeTab}
						dispatch={dispatch}
						type="active-tab-change"
						payload="tasks"
						position="right"
						text="TASKS"
					/>
				</TabsToggle>
				{state.activeTab === 'users' ? <AdminOperationsUsers /> : <AdminOperationsTasks />}
			</section>
			<section className={styles.result}>Result</section>
		</main>
	);
};

export default AdminDashboardPage;
