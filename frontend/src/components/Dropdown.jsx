import { useEffect, useRef, useContext } from 'react';

// React Router
import { useNavigate, NavLink } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './Dropdown.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Dropdown = ({ setShowDropdown }) => {
	const dropdownRef = useRef(null);

	const { logout } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = e => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [dropdownRef, setShowDropdown]);

	const handleLogout = () => {
		setShowDropdown(false);
		logout();
		navigate('/');
	};

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<div className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
				<FontAwesomeIcon icon={faGear} />
				<NavLink to="/profile" className={styles.link}>
					Profile
				</NavLink>
			</div>
			<div className={styles.dropdownItem} onClick={handleLogout}>
				<FontAwesomeIcon icon={faRightFromBracket} />
				<p>Logout</p>
			</div>
		</div>
	);
};

export default Dropdown;

Dropdown.propTypes = {
	setShowDropdown: PropTypes.func,
};
