import styles from './FormButtons.module.css';

// PropTypes
import PropTypes from 'prop-types';

const FormButtons = ({ children }) => {
	return <div className={styles.formButtons}>{children}</div>;
};

export default FormButtons;

FormButtons.propTypes = {
	children: PropTypes.node,
};
