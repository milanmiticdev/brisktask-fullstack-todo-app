// Styles
import styles from './SelectOption.module.css';

// PropTypes
import PropTypes from 'prop-types';

const SelectOption = ({ text, onClick }) => {
	return (
		<div className={styles.option} onClick={onClick}>
			{text}
		</div>
	);
};

export default SelectOption;

SelectOption.propTypes = {
	text: PropTypes.string,
	onClick: PropTypes.func,
};
