// Styles
import styles from './TabsToggle.module.css';

// PropTypes
import PropTypes from 'prop-types';

const TabsToggle = ({ children }) => {
	return <div className={styles.tabsToggle}>{children}</div>;
};

export default TabsToggle;

TabsToggle.propTypes = {
	children: PropTypes.node,
};
