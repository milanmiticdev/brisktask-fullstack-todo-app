// React
import { useState } from 'react';

// Components
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import Modal from './Modal.jsx';

// Styles
import styles from './FormWrapper.module.css';

const Form = () => {
	const [isLogging, setIsLogging] = useState(true);
	const [modal, setModal] = useState({
		isOpen: false,
		error: false,
		message: '',
	});

	return (
		<section className={styles.formWrapper}>
			<div className={styles.formToggle}>
				<div
					onClick={() => setIsLogging(true)}
					className={`${styles.toggleTab} ${styles.toggleTabLeft} ${isLogging && styles.activeTab}`}
				>
					LOGIN
				</div>
				<div
					onClick={() => setIsLogging(false)}
					className={`${styles.toggleTab} ${styles.toggleTabRight} ${!isLogging && styles.activeTab}`}
				>
					REGISTER
				</div>
			</div>

			{modal.isOpen && <Modal modal={modal} setModal={setModal} />}
			{isLogging ? <LoginForm setModal={setModal} /> : <RegisterForm setModal={setModal} />}
		</section>
	);
};

export default Form;
