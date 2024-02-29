// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './Modal.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Modal = ({ modal, onDispatch }) => {
	const handleCloseModal = () => onDispatch({ type: 'modal-change', payload: { open: false, error: false, message: '' } });

	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				<button onClick={handleCloseModal} className={styles.closeBtn}>
					X
				</button>
				<div className={modal.error ? `${styles.icon} ${styles.error}` : `${styles.icon} ${styles.success}`}>
					{modal.error ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faCheck} />}
				</div>
				<p className={styles.message}>{modal.message}</p>
			</div>
		</div>
	);
};

export default Modal;

Modal.propTypes = {
	modal: PropTypes.object,
	onDispatch: PropTypes.func,
	navigate: PropTypes.func,
};
