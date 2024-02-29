// React
import { useState } from 'react';

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
			<FormBtn text={text} type="button" onClick={onClick} />
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
