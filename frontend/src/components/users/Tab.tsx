// Styles
import styles from './Tab.module.css';

// Types
import type { TabProps } from './../../types/prop.types';

const Tab = ({ section, onDispatch, type, payload, position, text }: TabProps): JSX.Element => {
	return (
		<div
			className={`${styles.tab} ${position === 'left' ? styles.left : styles.right} ${section === payload && styles.active}`}
			onClick={() => onDispatch({ type: type, payload: payload })}
		>
			{text}
		</div>
	);
};

export default Tab;
