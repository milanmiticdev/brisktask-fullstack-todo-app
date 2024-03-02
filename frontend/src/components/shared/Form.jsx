// Styles
import styles from './Form.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Form = ({ heading, children, onSubmit }) => {
	return (
		<form className={styles.form} onSubmit={onSubmit}>
			{heading && <h1 className={styles.heading}>{heading}</h1>}
			{children}
		</form>
	);
};

export default Form;

Form.propTypes = {
	heading: PropTypes.string,
	children: PropTypes.node,
	onSubmit: PropTypes.func,
};
