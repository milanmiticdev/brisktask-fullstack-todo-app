// Styles
import styles from './Page.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Page = ({ center, children }) => {
	return <main className={center ? `${styles.page} ${styles.center}` : `${styles.page}`}>{children}</main>;
};

export default Page;

Page.propTypes = {
	center: PropTypes.bool,
	children: PropTypes.node,
};
