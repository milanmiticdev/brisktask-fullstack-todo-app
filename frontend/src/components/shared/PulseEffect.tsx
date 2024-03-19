// Styles
import styles from './PulseEffect.module.css';

// Types
import type { PulseEffectProps } from './../../types/prop.types';

const PulseEffect = ({ text }: PulseEffectProps): JSX.Element => {
	return <div className={styles.blob}>{text}</div>;
};

export default PulseEffect;
