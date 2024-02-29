// Components
import TableRow from './../components/TableRow.jsx';

// Styles
import styles from './Table.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Table = ({ category, result }) => {
	return (
		<section className={styles.result}>
			<table className={styles.table}>
				<thead className={styles.head}>
					<TableRow parent="head" category={category} result={result} />
				</thead>
				<tbody className={styles.body}>
					{result.map(row => (
						<TableRow
							key={row.id}
							parent="body"
							category={category}
							id={row.id}
							email={row.email ? row.email : null}
							creator={row.userEmail ? row.userEmail : null}
						/>
					))}
				</tbody>
			</table>
		</section>
	);
};

export default Table;

Table.propTypes = {
	category: PropTypes.string,
	result: PropTypes.array,
};
