// React Router
import { Link } from 'react-router-dom';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './TableRow.module.css';

// PropTypes
import PropTypes from 'prop-types';

const TableRow = ({ parent, id, email, result }) => {
	return (
		<tr className={styles.row}>
			{parent === 'head' ? (
				<>
					<th scope="col">ID</th>
					{result.users ? <th scope="col">EMAIL</th> : <th scope="col">CREATOR</th>}
					<th scope="col">
						<FontAwesomeIcon icon={faEye} />
					</th>
				</>
			) : (
				<>
					<th scope="row">{id}</th>
					<td>{email}</td>
					<td>
						<Link to={category === 'users' ? `/dashboard/users/${id}` : `/dashboard/tasks/${id}`}>
							<button className={styles.viewBtn}>View</button>
						</Link>
					</td>
				</>
			)}
		</tr>
	);
};

export default TableRow;

TableRow.propTypes = {
	parent: PropTypes.string,
	id: PropTypes.number,
	email: PropTypes.string,
	result: PropTypes.array,
};
