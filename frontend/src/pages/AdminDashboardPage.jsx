//React
import { useState } from 'react';

// Components
import AdminOperationsUsers from './../components/AdminOperationsUsers.jsx';
import AdminOperationsTasks from './../components/AdminOperationsTasks.jsx';

// Styles
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
	const [activeTab, setActiveTab] = useState('users');

	return (
		<main className={styles.dashboardPage}>
			<section className={styles.operations}>
				<div className={styles.operationsToggle}>
					<div
						onClick={() => setActiveTab('users')}
						className={`${styles.toggleTab} ${styles.toggleTabLeft} ${activeTab === 'users' && styles.activeTab}`}
					>
						USERS
					</div>
					<div
						onClick={() => setActiveTab('tasks')}
						className={`${styles.toggleTab} ${styles.toggleTabRight} ${activeTab === 'tasks' && styles.activeTab}`}
					>
						TASKS
					</div>
				</div>
				{activeTab === 'users' ? <AdminOperationsUsers /> : <AdminOperationsTasks />}
			</section>
			<section className={styles.result}>Result</section>
		</main>
	);
};

export default AdminDashboardPage;
