import styles from './PulseEffect.module.css';

// PropTypes
import PropTypes from 'prop-types';

const PulseEffect = ({ text }) => {
	return <div className={styles.blob}>{text}</div>;
};

export default PulseEffect;

PulseEffect.propTypes = {
	text: PropTypes.string,
};
