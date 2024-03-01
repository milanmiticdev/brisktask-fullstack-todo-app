// Styles
import styles from './AdminActionsBtn.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActionsBtn = ({ text, onDispatch }) => {
	const handleSelect = () => onDispatch({ type: 'selecting-change', payload: true });

	return (
		<div className={styles.selectBtn} onClick={handleSelect}>
			{text}
		</div>
	);
};

export default AdminActionsBtn;

AdminActionsBtn.propTypes = {
	text: PropTypes.string,
	onDispatch: PropTypes.func,
};
