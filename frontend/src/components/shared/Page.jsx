// Styles
import styles from './Page.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Page = ({ home, loading, children }) => {
	return (
		<main className={home ? `${styles.home}` : loading ? `${styles.page} ${styles.loading}` : `${styles.page}`}>
			{children ? children : null}
		</main>
	);
};

export default Page;

Page.propTypes = {
	home: PropTypes.bool,
	loading: PropTypes.bool,
	children: PropTypes.node,
};
