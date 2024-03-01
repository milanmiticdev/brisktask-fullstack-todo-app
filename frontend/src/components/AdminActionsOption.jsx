// React
import { useState } from 'react';

// React Router
import { Link } from 'react-router-dom';

// Components
import FormBtn from './FormBtn.jsx';

// Styles
import styles from './AdminActionsOption.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActionsOption = ({ text, input, onClick, onDispatch }) => {
	const [field, setField] = useState('');

	return (
		<div className={styles.option}>
			{input && (
				<input
					className={styles.input}
					type="number"
					value={field}
					onChange={e => {
						setField(e.target.value);
						onDispatch({ type: 'id-change', payload: e.target.value });
					}}
				/>
			)}
			{onClick ? (
				<FormBtn text={text} type="button" onClick={onClick} />
			) : (
				<Link to={'/dashboard/create-user'} className={styles.link}>
					<FormBtn text={text} type="button" />
				</Link>
			)}
		</div>
	);
};

export default AdminActionsOption;

AdminActionsOption.propTypes = {
	text: PropTypes.string,
	input: PropTypes.bool,
	onClick: PropTypes.func,
	onDispatch: PropTypes.func,
};
