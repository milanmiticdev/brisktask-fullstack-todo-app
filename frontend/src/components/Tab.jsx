// Styles
import styles from './Tab.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Tab = ({ section, dispatch, type, payload, position, text }) => {
	return (
		<div
			className={`${styles.tab} ${position === 'left' ? styles.left : styles.right} ${section === payload && styles.active}`}
			onClick={() => dispatch({ type: type, payload: payload })}
		>
			{text}
		</div>
	);
};

export default Tab;

Tab.propTypes = {
	section: PropTypes.string,
	dispatch: PropTypes.func,
	type: PropTypes.string,
	payload: PropTypes.string,
	position: PropTypes.string,
	text: PropTypes.string,
};
