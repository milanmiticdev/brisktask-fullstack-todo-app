// Styles
import styles from './Button.module.css';

// Types
import type { ButtonProps } from './../../types/prop.types';

const Button = ({ text, type, color, onClick }: ButtonProps): JSX.Element => {
	return (
		<button type={type} className={`${styles.button} ${styles[color]}`} onClick={type === 'button' ? onClick : () => null}>
			{text}
		</button>
	);
};

export default Button;
