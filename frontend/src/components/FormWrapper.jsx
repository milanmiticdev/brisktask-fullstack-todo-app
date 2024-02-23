// React
import { useState } from 'react';

// Components
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';

// Styles
import styles from './FormWrapper.module.css';

const Form = () => {
	const [isLogging, setIsLogging] = useState(true);

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

			{isLogging ? <LoginForm /> : <RegisterForm />}
		</section>
	);
};

export default Form;
