//React
import { useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from '../contexts/AuthContext.js';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './TableRow.module.css';

// PropTypes
import PropTypes from 'prop-types';

const TableRow = ({ category, parent, id, email, dispatch }) => {
	const navigate = useNavigate();
	const { token } = useContext(AuthContext);

	const deleteRow = async () => {
		try {
			dispatch({ type: 'loading-check', payload: true });
			dispatch({ type: 'spinner-text-change', payload: 'Deleting' });

			const response = await fetch(`http://localhost:5174/api/v1/${category}/${id}`, {
				method: 'DELETE',
				body: null,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 204) {
				navigate(0);
			} else {
				const data = await response.json();

				dispatch({ type: 'spinner-text-change', payload: '' });
				dispatch({ type: 'loading-check', payload: false });
				dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'spinner-text-change', payload: '' });
			dispatch({ type: 'loading-check', payload: false });
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
		}
	};

	return (
		<>
			{parent === 'head' ? (
				<tr className={styles.row}>
					<th scope="col">ID</th>
					{category === 'users' ? <th scope="col">EMAIL</th> : <th scope="col">CREATOR</th>}
					<th scope="col">
						<FontAwesomeIcon icon={faEye} />
					</th>
				</tr>
			) : (
				<tr className={styles.row}>
					<th scope="row">{id}</th>
					<td>{email}</td>
					<td>
						<button className={styles.viewBtn}>View</button>
					</td>
				</tr>
			)}
		</>
	);
};

export default TableRow;

TableRow.propTypes = {
	category: PropTypes.string,
	parent: PropTypes.string,
	id: PropTypes.number,
	email: PropTypes.string,
	dispatch: PropTypes.func,
};
