// Styles
import styles from './Form.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Form = ({ children, onSubmit }) => {
	return (
		<form className={styles.form} onSubmit={onSubmit}>
			{children}
		</form>
	);
};

export default Form;

Form.propTypes = {
	children: PropTypes.node,
	onSubmit: PropTypes.func,
};
