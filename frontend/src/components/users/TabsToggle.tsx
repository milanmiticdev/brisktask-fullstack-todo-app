// Styles
import styles from './TabsToggle.module.css';

// Types
import type { TabsToggleProps } from './../../types/prop.types';

const TabsToggle = ({ children }: TabsToggleProps): JSX.Element => {
	return <div className={styles.tabsToggle}>{children}</div>;
};

export default TabsToggle;
