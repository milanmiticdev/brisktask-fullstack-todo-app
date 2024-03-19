// Styles
import styles from './Page.module.css';

// Types
import type { PageProps } from './../../types/prop.types';

const Page = ({ center, children }: PageProps): JSX.Element => {
	return <main className={center ? `${styles.page} ${styles.center}` : `${styles.page}`}>{children}</main>;
};

export default Page;
