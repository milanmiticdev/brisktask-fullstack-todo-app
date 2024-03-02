// Styles
import styles from './FormBtn.module.css';

// PropTypes
import PropTypes from 'prop-types';

const FormBtn = ({ text, type, color = 'blue', onClick }) => {
	return (
		<button type={type} className={`${styles.formBtn} ${styles[color]}`} onClick={onClick ? onClick : () => null}>
			{text}
		</button>
	);
};

export default FormBtn;

FormBtn.propTypes = {
	text: PropTypes.string,
	type: PropTypes.string,
	color: PropTypes.string,
	onClick: PropTypes.func,
};
