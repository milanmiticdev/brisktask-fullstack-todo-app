// React
import { useContext } from 'react';

// Context
import AuthContext from '../contexts/AuthContext.js';

// React Router
import { NavLink } from 'react-router-dom';

// Styles
import styles from './Navbar.module.css';

const NavBar = () => {
	const { userRole, token } = useContext(AuthContext);

	return (
		<nav className={styles.navbar}>
			{token && userRole === 'admin' ? (
				<>
					<ul className={styles.list}>
						<NavLink
							to="/"
							className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
						>
							<li>HOME</li>
						</NavLink>
						<NavLink
							to="/dashboard"
							className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
						>
							<li>DASHBOARD</li>
						</NavLink>
						<NavLink
							to="/profile"
							className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
						>
							<li>PROFILE</li>
						</NavLink>
					</ul>
				</>
			) : token && userRole === 'user' ? (
				<>
					<ul className={styles.list}>
						<li>
							<NavLink
								to="/"
								className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
							>
								HOME
							</NavLink>
						</li>
						<li>
							<NavLink
								to={`/tasks`}
								className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
							>
								TASKS
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/create"
								className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
							>
								CREATE
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/profile"
								className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
							>
								PROFILE
							</NavLink>
						</li>
					</ul>
				</>
			) : (
				<ul className={styles.list}>
					<NavLink to="/" className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}>
						<li>HOME</li>
					</NavLink>
					<NavLink
						to="/auth"
						className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
					>
						<li>AUTHENTICATE</li>
					</NavLink>
				</ul>
			)}
		</nav>
	);
};

export default NavBar;
