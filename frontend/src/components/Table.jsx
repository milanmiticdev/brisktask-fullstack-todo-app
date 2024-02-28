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
					<TableRow parent="head" category={category} />
				</thead>
				<tbody className={styles.body}>
					{result.map(row => (
						<TableRow
							key={row.id}
							parent="body"
							category={category}
							id={row.id}
							email={category === 'users' ? row.email : row.userEmail}
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
