//React
import { useReducer, useEffect } from 'react';

// Components
import TabsToggle from './../components/TabsToggle.jsx';
import Tab from './../components/Tab.jsx';

// Styles
import styles from './AdminDashboardPage.module.css';

const initialState = {
	activeTab: 'users',
	isSelecting: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'active-tab-change':
			return { ...state, activeTab: action.payload };
		case 'is-selecting':
			return { ...state, isSelecting: action.payload };
	}
};

const AdminDashboardPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleSelect = () => {
		dispatch({ type: 'is-selecting', payload: !state.isSelecting });
	};

	useEffect(() => {
		dispatch({ type: 'is-selecting', payload: false });
	}, [state.activeTab]);

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
				{state.activeTab === 'users' ? (
					<section className={styles.selection}>
						<button className={styles.selectBtn} onClick={handleSelect}>
							SELECT ACTION
						</button>
						{state.isSelecting && (
							<div className={styles.actions}>
								<div className={styles.action}>GET ALL USERS</div>
								<div className={styles.action}>GET SINGLE USER</div>
								<div className={styles.action}>CREATE USER</div>
								<div className={styles.action}>UPDATE USER</div>
								<div className={styles.action}>DELETE USER</div>
							</div>
						)}
					</section>
				) : (
					<section className={styles.selection}>
						<button className={styles.selectBtn} onClick={handleSelect}>
							SELECT ACTION
						</button>
						{state.isSelecting && (
							<div className={styles.actions}>
								<div className={styles.action}>GET ALL TASKS</div>
								<div className={styles.action}>GET TASKS BY USER</div>
								<div className={styles.action}>GET SINGLE TASK</div>
								<div className={styles.action}>CREATE TASK</div>
								<div className={styles.action}>UPDATE TASK</div>
								<div className={styles.action}>DELETE TASK</div>
							</div>
						)}
					</section>
				)}
			</section>
			<section className={styles.result}>Result</section>
		</main>
	);
};

export default AdminDashboardPage;
