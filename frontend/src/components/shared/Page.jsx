// Styles
import styles from './Page.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Page = ({ loading, children }) => {
	return <main className={loading ? `${styles.page} ${styles.loading}` : `${styles.page}`}>{children}</main>;
};

export default Page;

Page.propTypes = {
	loading: PropTypes.bool,
	children: PropTypes.node,
};
