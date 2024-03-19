// Styles
import styles from './Message.module.css';

// Types
import type { MessageProps } from './../../types/prop.types';

const Message = ({ message }: MessageProps): JSX.Element => {
	return (
		<div className={styles.span}>
			<span>{message}</span>
		</div>
	);
};

export default Message;
