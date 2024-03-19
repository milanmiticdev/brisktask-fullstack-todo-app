// Styles
import styles from './Form.module.css';

// Types
import type { FormProps } from './../../types/prop.types';

const Form = ({ heading, children, onSubmit }: FormProps): JSX.Element => {
	return (
		<form className={styles.form} onSubmit={onSubmit}>
			{heading && <h1 className={styles.heading}>{heading}</h1>}
			{children}
		</form>
	);
};

export default Form;
