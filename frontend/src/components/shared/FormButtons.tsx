// Styles
import styles from './FormButtons.module.css';

// Types
import type { FormButtonsProps } from './../../types/prop.types';

const FormButtons = ({ children }: FormButtonsProps): JSX.Element => {
	return <div className={styles.formButtons}>{children}</div>;
};

export default FormButtons;
