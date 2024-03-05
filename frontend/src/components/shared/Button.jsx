// Styles
import styles from './Button.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Button = ({ text, type, color, onClick }) => {
	return (
		<button type={type} className={`${styles.button} ${styles[color]}`} onClick={onClick ? onClick : null}>
			{text}
		</button>
	);
};

export default Button;

Button.propTypes = {
	text: PropTypes.string,
	type: PropTypes.string,
	color: PropTypes.string,
	onClick: PropTypes.func,
};
