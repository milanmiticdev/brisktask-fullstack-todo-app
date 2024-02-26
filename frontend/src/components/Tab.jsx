// Styles
import styles from './Tab.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Tab = ({ activeTab, dispatch, type, payload, position, text }) => {
	return (
		<div
			className={`${styles.tab} ${position === 'left' ? styles.left : styles.right} ${activeTab === payload && styles.active}`}
			onClick={() => dispatch({ type: type, payload: payload })}
		>
			{text}
		</div>
	);
};

export default Tab;

Tab.propTypes = {
	activeTab: PropTypes.string,
	dispatch: PropTypes.func,
	type: PropTypes.string,
	payload: PropTypes.string,
	position: PropTypes.string,
	text: PropTypes.string,
};
