// Styles
import styles from './Spinner.module.css';

// Types
import type { SpinnerProps } from './../../types/prop.types';

const Spinner = ({ text }: SpinnerProps): JSX.Element => {
	return (
		<div className={styles.spinner}>
			{text}
			<div className={`${styles.spinnerSector} ${styles.spinnerSectorTop}`}></div>
			<div className={`${styles.spinnerSector} ${styles.spinnerSectorBottom}`}></div>
		</div>
	);
};

export default Spinner;
