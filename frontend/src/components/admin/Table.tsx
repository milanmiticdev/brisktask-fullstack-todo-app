// Components
import TableRow from './TableRow';

// Styles
import styles from './Table.module.css';

// Types
import type { TableProps } from './../../types/prop.types';

const Table = ({ result }: TableProps): JSX.Element => {
	return (
		<section className={styles.result}>
			{result && (
				<table className={styles.table}>
					<thead className={styles.head}>
						<TableRow parent="head" section={Array.isArray(result) ? result[0].section : result.section} />
					</thead>
					<tbody className={styles.body}>
						{Array.isArray(result) &&
							result.map(row => (
								<TableRow
									key={row.id}
									parent="body"
									section={row.section}
									id={row.id}
									email={row.section === 'users' ? row.email : row.userEmail}
								/>
							))}
						{!Array.isArray(result) && result && Object.keys(result).length > 0 && (
							<TableRow
								key={result.id}
								parent="body"
								section={result.section}
								id={result.id}
								email={result.section === 'users' ? result.email : result.userEmail}
							/>
						)}
					</tbody>
				</table>
			)}
		</section>
	);
};

export default Table;
