// React
import { useState, useEffect } from 'react';

// React Router
import { Link } from 'react-router-dom';

// Styles
import styles from './ActionsOption.module.css';

// PropTypes
import PropTypes from 'prop-types';

const ActionsOption = ({ text, input, onSubmit, fieldChange, onDispatch }) => {
	const [field, setField] = useState('');

	useEffect(() => {
		if (onDispatch && fieldChange) onDispatch({ type: fieldChange, payload: field });
	}, [field, fieldChange, onDispatch]);

	return (
		<div className={styles.option}>
			{onSubmit ? (
				<form onSubmit={onSubmit} className={styles.form}>
					{input && (
						<input
							className={styles.input}
							type="number"
							value={field}
							onChange={e => {
								setField(e.target.value);
							}}
						/>
					)}
					<button type="submit" className={styles.btn}>
						{text}
					</button>
				</form>
			) : (
				<Link to={'/dashboard/create-user'} className={styles.link}>
					<button type="button" className={styles.btn}>
						{text}
					</button>
				</Link>
			)}
		</div>
	);
};

export default ActionsOption;

ActionsOption.propTypes = {
	text: PropTypes.string,
	input: PropTypes.bool,
	onSubmit: PropTypes.func,
	fieldChange: PropTypes.string,
	onDispatch: PropTypes.func,
};
