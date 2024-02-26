// Styles
import styles from './Tab.module.css';

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
