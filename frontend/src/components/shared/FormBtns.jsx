import styles from './FormBtns.module.css';

// PropTypes
import PropTypes from 'prop-types';

const FormBtns = ({ children }) => {
	return <div className={styles.formBtns}>{children}</div>;
};

export default FormBtns;

FormBtns.propTypes = {
	children: PropTypes.node,
};
