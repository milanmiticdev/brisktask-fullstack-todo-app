// Components
import Navbar from './Navbar.jsx';

// Styles
import styles from './Header.module.css';

const Header = () => {
	return (
		<header className={styles.header}>
			<Navbar />
		</header>
	);
};

export default Header;
