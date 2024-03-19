// Styles
import styles from './Section.module.css';

// Types
import type { SectionProps } from './../../types/prop.types';

const Section = ({ children }: SectionProps): JSX.Element => {
	return <section className={styles.section}>{children}</section>;
};

export default Section;
