// Styles
import styles from './AdminActions.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActions = ({ children }) => {
	return <section className={styles.actions}>{children}</section>;
};

export default AdminActions;

AdminActions.propTypes = {
	children: PropTypes.node,
};
