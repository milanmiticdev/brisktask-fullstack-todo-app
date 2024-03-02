// React
import { useState, useEffect } from 'react';

// React Router
import { Link } from 'react-router-dom';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './TableRow.module.css';

// PropTypes
import PropTypes from 'prop-types';

const TableRow = ({ parent, section, id, email }) => {
	const [emailField, setEmailField] = useState(email ? email : '');
	const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	useEffect(() => {
		function handleWindowResize() {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		}

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	useEffect(() => {
		if (email) {
			if (windowSize.width < 300) {
				if (email.length > 10) {
					setEmailField(`${email.slice(0, 7)}...`);
				} else {
					setEmailField(email);
				}
			} else if (windowSize.width >= 300 && windowSize.width < 400) {
				if (email.length > 19) {
					setEmailField(`${email.slice(0, 16)}...`);
				} else {
					setEmailField(email);
				}
			} else if (windowSize.width >= 400 && windowSize.width < 500) {
				if (email.length > 22) {
					setEmailField(`${email.slice(0, 19)}...`);
				} else {
					setEmailField(email);
				}
			} else if (windowSize.width >= 500 && windowSize.width < 600) {
				if (email.length > 30) {
					setEmailField(`${email.slice(0, 27)}...`);
				} else {
					setEmailField(email);
				}
			} else if (windowSize.width >= 600 && windowSize.width < 700) {
				if (email.length > 34) {
					setEmailField(`${email.slice(0, 31)}...`);
				} else {
					setEmailField(email);
				}
			} else if (windowSize.width >= 700 && windowSize.width < 800) {
				if (email.length > 42) {
					setEmailField(`${email.slice(0, 39)}...`);
				} else {
					setEmailField(email);
				}
			} else if (windowSize.width >= 800 && windowSize.width < 1000) {
				if (email.length > 50) {
					setEmailField(`${email.slice(0, 47)}...`);
				} else {
					setEmailField(email);
				}
			} else {
				if (email.length > 58) {
					setEmailField(`${email.slice(0, 55)}...`);
				} else {
					setEmailField(email);
				}
			}
		}
	}, [email, windowSize.width]);

	return (
		<tr className={styles.row}>
			{parent === 'head' ? (
				<>
					<th scope="col">ID</th>
					<th scope="col">{section === 'users' ? 'EMAIL' : 'CREATOR'}</th>
					<th scope="col">
						<FontAwesomeIcon icon={faEye} />
					</th>
				</>
			) : (
				<>
					<th scope="row">{id + 998}</th>
					<td>{emailField}</td>
					<td>
						<Link to={`/dashboard/${section}/${id}`} className={styles.link}>
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
	section: PropTypes.string,
	id: PropTypes.number,
	email: PropTypes.string,
	result: PropTypes.array,
};
