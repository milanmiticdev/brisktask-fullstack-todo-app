// Components
import TableRow from './../components/TableRow.jsx';

// Styles
import styles from './Table.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Table = ({ result }) => {
	return (
		<section className={styles.result}>
			<table className={styles.table}>
				<thead className={styles.head}>
					<TableRow
						parent="head"
						section={Array.isArray(result) ? result[0].section : result && Object.keys(result).length > 0 && result.section}
					/>
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
		</section>
	);
};

export default Table;

Table.propTypes = {
	section: PropTypes.string,
	result: PropTypes.array,
};
