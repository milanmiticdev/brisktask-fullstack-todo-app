// Components
import Navbar from './Navbar';

// Styles
import styles from './Header.module.css';

const Header = (): JSX.Element => {
	return (
		<header className={styles.header}>
			<Navbar />
		</header>
	);
};

export default Header;
