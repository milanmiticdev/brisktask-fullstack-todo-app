import styles from './../components/Message.module.css';

const Message = ({ message }) => {
	return (
		<div className={styles.span}>
			<span>{message}</span>
		</div>
	);
};

export default Message;
