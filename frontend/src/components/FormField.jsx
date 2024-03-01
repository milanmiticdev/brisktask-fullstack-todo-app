// React
import { useState, useEffect } from 'react';

// Components
import Message from './Message.jsx';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './FormField.module.css';

// PropTypes
import PropTypes from 'prop-types';

const FormField = ({ name, type, initial, onDispatch, fieldChange, onValidate, section, readOnly, autoFocus, fetchedValue }) => {
	const [field, setField] = useState(() => ({ value: initial ? initial : '', error: false, message: '' }));
	const [passwordVisible, setPasswordVisible] = useState(false);

	const handlePasswordVisibility = () => setPasswordVisible(prevState => !prevState);

	useEffect(() => {
		if (onDispatch && fieldChange) onDispatch({ type: fieldChange, payload: field });
	}, [field, fieldChange, onDispatch]);

	useEffect(() => {
		if (section) setField({ value: '', error: false, message: '' });
	}, [section]);

	return (
		<div className={styles.formField}>
			<div className={styles.inputBlock}>
				<label htmlFor={name} className={styles.label}>
					{`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
				</label>
				<div className={readOnly ? `${styles.inputField} ${styles.inputFieldReadOnly}` : `${styles.inputField}`}>
					<input
						className={styles.input}
						type={passwordVisible ? 'text' : type}
						id={name}
						name={name}
						value={readOnly && fetchedValue ? fetchedValue : field.value}
						onChange={e => {
							setField(prevState => ({
								...prevState,
								value: readOnly ? prevState.value : e.target.value,
								error: readOnly ? prevState.error : onValidate(e.target.value).error,
								message: readOnly ? prevState.message : onValidate(e.target.value).message,
							}));
						}}
						readOnly={readOnly}
						autoFocus={autoFocus}
					/>
					{type === 'password' && (
						<div className={styles.icon}>
							{passwordVisible ? (
								<FontAwesomeIcon icon={faEyeSlash} onClick={handlePasswordVisibility} />
							) : (
								<FontAwesomeIcon icon={faEye} onClick={handlePasswordVisibility} />
							)}
						</div>
					)}
				</div>
			</div>
			{!readOnly && <Message message={field.message} />}
		</div>
	);
};

export default FormField;

FormField.propTypes = {
	name: PropTypes.string,
	type: PropTypes.string,
	onValidate: PropTypes.func,
	onDispatch: PropTypes.func,
	fieldChange: PropTypes.string,
	section: PropTypes.string,
	initial: PropTypes.string,
	readOnly: PropTypes.bool,
	autoFocus: PropTypes.bool,
	fetchedValue: PropTypes.string,
};
