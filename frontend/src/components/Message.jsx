// Styles
import styles from './../components/Message.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Message = ({ message }) => {
	return (
		<div className={styles.span}>
			<span>{message}</span>
		</div>
	);
};

export default Message;

Message.propTypes = {
	message: PropTypes.string,
};
