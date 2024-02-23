// React
import { useContext } from 'react';

// Context
import AuthContext from '../contexts/AuthContext.js';

// React Router
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './Navbar.module.css';

const NavBar = () => {
	const { userId, userRole, token, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<nav className={styles.navbar}>
			{token && userRole === 'admin' ? (
				<>
					<ul className={styles.list}>
						<NavLink to="/" className={styles.listItem}>
							<li>HOME</li>
						</NavLink>
						<NavLink to="/dashboard" className={styles.listItem}>
							<li>DASHBOARD</li>
						</NavLink>
						<NavLink to="/profile" className={styles.listItem}>
							<li>PROFILE</li>
						</NavLink>
					</ul>
				</>
			) : token && userRole === 'user' ? (
				<>
					<ul className={styles.list}>
						<NavLink to="/" className={styles.listItem}>
							<li>HOME</li>
						</NavLink>
						<NavLink to={`/tasks`} className={styles.listItem}>
							<li>TASKS</li>
						</NavLink>
						<NavLink to="/tasks/create" className={styles.listItem}>
							<li>CREATE</li>
						</NavLink>
						<NavLink to="/profile" className={styles.listItem}>
							<li>PROFILE</li>
						</NavLink>
						<button onClick={handleLogout}>LOGOUT</button>
					</ul>
				</>
			) : (
				<ul className={styles.list}>
					<NavLink to="/" className={styles.listItem}>
						<li>HOME</li>
					</NavLink>
					<NavLink to="/auth" className={styles.auth}>
						<li>AUTHENTICATE</li>
					</NavLink>
				</ul>
			)}
		</nav>
	);
};

export default NavBar;
