// React
import { useState, useContext } from 'react';

// Context
import AuthContext from './../../contexts/AuthContext.js';

// React Router
import { NavLink, useNavigate } from 'react-router-dom';

// Components
import Dropdown from './Dropdown.jsx';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './Navbar.module.css';

const NavBar = () => {
	const [showDropdown, setShowDropdown] = useState(false);

	const { userRole, token, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		setShowDropdown(false);
		logout();
		navigate('/');
	};

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
						<FontAwesomeIcon icon={faRightFromBracket} onClick={handleLogout} className={styles.listItem} />
					</ul>
				</>
			) : token && userRole === 'user' ? (
				<>
					<ul className={styles.list}>
						<NavLink
							to="/"
							className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
						>
							<li>HOME</li>
						</NavLink>
						<NavLink
							to={`/tasks`}
							className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
						>
							<li>TASKS</li>
						</NavLink>
						<NavLink
							to="/create-task"
							className={({ isActive }) => (isActive ? `${styles.listItem} ${styles.active}` : `${styles.listItem}`)}
						>
							<li>CREATE</li>
						</NavLink>
						<div className={styles.avatar}>
							<FontAwesomeIcon icon={faUser} onClick={() => setShowDropdown(true)} className={styles.icon} />
							{showDropdown && <Dropdown setShowDropdown={setShowDropdown} />}
						</div>
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
