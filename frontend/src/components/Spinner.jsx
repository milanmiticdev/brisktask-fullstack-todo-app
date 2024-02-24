import styles from './Spinner.module.css';

const Spinner = ({ text }) => {
	return (
		<div className={styles.spinner}>
			{text}
			<div className={`${styles.spinnerSector} ${styles.spinnerSectorTop}`}></div>
			<div className={`${styles.spinnerSector} ${styles.spinnerSectorBottom}`}></div>
		</div>
	);
};

export default Spinner;
