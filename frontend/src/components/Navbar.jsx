// React Router
import { NavLink } from 'react-router-dom';

// Styles
import styles from './Navbar.module.css';

const NavBar = () => {
	return (
		<nav className={styles.navbar}>
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
				<NavLink to="/auth" className={styles.auth}>
					<li>AUTHENTICATE</li>
				</NavLink>
			</ul>
		</nav>
	);
};

export default NavBar;
