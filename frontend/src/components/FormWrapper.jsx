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
				<button onClick={() => setIsLogging(true)} className={styles.formButton}>
					LOGIN
				</button>
				<button onClick={() => setIsLogging(false)} className={styles.formButton}>
					REGISTER
				</button>
			</div>

			{isLogging ? <LoginForm /> : <RegisterForm />}
		</section>
	);
};

export default Form;
