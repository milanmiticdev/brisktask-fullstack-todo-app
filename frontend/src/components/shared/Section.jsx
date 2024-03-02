// Styles
import styles from './Section.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Section = ({ children }) => {
	return <section className={styles.section}>{children}</section>;
};

export default Section;

Section.propTypes = {
	children: PropTypes.node,
};
