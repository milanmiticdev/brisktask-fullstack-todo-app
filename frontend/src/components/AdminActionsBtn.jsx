// Styles
import styles from './AdminActionsBtn.module.css';

// PropTypes
import PropTypes from 'prop-types';

const AdminActionsBtn = ({ text, setIsSelecting }) => {
	const handleSelect = () => setIsSelecting(true);

	return (
		<div className={styles.selectBtn} onClick={handleSelect}>
			{text}
		</div>
	);
};

export default AdminActionsBtn;

AdminActionsBtn.propTypes = {
	text: PropTypes.string,
	setIsSelecting: PropTypes.func,
};
