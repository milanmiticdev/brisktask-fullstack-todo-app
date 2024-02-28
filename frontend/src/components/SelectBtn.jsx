// Styles
import styles from './SelectBtn.module.css';

// PropTypes
import PropTypes from 'prop-types';

const SelectBtn = ({ text, dispatch }) => {
	const handleSelect = () => {
		dispatch({ type: 'is-selecting', payload: true });
	};

	return (
		<div className={styles.selectBtn} onClick={handleSelect}>
			{text}
		</div>
	);
};

export default SelectBtn;

SelectBtn.propTypes = {
	text: PropTypes.string,
	isSelecting: PropTypes.bool,
	dispatch: PropTypes.func,
};
