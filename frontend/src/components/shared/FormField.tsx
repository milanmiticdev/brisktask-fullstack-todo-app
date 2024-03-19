// React
import { useState, useEffect, ChangeEvent } from 'react';

// Components
import Message from './Message';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './FormField.module.css';

// Types
import type { FormFieldProps } from './../../types/prop.types';

interface windowSize {
	width: number;
	height: number;
}

const FormField = ({
	name,
	type,
	initial,
	onDispatch,
	fieldChange,
	onValidate,
	section,
	readOnly,
	autoFocus,
}: FormFieldProps): JSX.Element => {
	const [field, setField] = useState(() => ({ value: initial ? initial : '', error: false, message: '' }));
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

	const [windowSize, setWindowSize] = useState<windowSize>({ width: window.innerWidth, height: window.innerHeight });
	const [readOnlyField, setReadOnlyField] = useState<string>('');

	const handlePasswordVisibility = (): void => setPasswordVisible(prevState => !prevState);

	useEffect(() => {
		const handleWindowResize = (): void => {
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		};

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	useEffect(() => {
		if (onDispatch && fieldChange) onDispatch({ type: fieldChange, payload: field });
	}, [field, fieldChange, onDispatch]);

	useEffect(() => {
		if (section) setField({ value: '', error: false, message: '' });
	}, [section]);

	useEffect(() => {
		if (initial && !readOnly) setField({ value: initial, error: false, message: '' });
	}, [initial, readOnly]);

	useEffect(() => {
		if (readOnly && initial && initial.length > 0) {
			if (windowSize.width < 300) {
				if (initial.length > 18) {
					setReadOnlyField(`${initial.slice(0, 15)}...`);
				} else {
					setReadOnlyField(initial);
				}
			} else if (windowSize.width >= 300 && windowSize.width < 400) {
				if (initial.length > 33) {
					setReadOnlyField(`${initial.slice(0, 30)}...`);
				} else {
					setReadOnlyField(initial);
				}
			} else if (windowSize.width >= 400 && windowSize.width < 500) {
				if (initial.length > 39) {
					setReadOnlyField(`${initial.slice(0, 36)}...`);
				} else {
					setReadOnlyField(initial);
				}
			} else if (windowSize.width >= 500 && windowSize.width < 600) {
				if (initial.length > 43) {
					setReadOnlyField(`${initial.slice(0, 40)}...`);
				} else {
					setReadOnlyField(initial);
				}
			} else if (windowSize.width >= 600 && windowSize.width < 700) {
				if (initial.length > 48) {
					setReadOnlyField(`${initial.slice(0, 45)}...`);
				} else {
					setReadOnlyField(initial);
				}
			} else {
				if (initial.length > 48) {
					setReadOnlyField(`${initial.slice(0, 45)}...`);
				} else {
					setReadOnlyField(initial);
				}
			}
		}
	}, [readOnly, initial, windowSize.width]);

	return (
		<div className={styles.formField}>
			<div className={styles.inputBlock}>
				<label htmlFor={name} className={styles.label}>
					{name && `${name.charAt(0).toUpperCase()}${name.slice(1)}`}
				</label>
				<div className={readOnly ? `${styles.inputField} ${styles.inputFieldReadOnly}` : `${styles.inputField}`}>
					<input
						className={styles.input}
						type={passwordVisible ? 'text' : type}
						id={name}
						name={name}
						value={readOnly && readOnlyField.length > 0 ? readOnlyField : field.value}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setField(prevState => ({
								...prevState,
								value: readOnly ? prevState.value : e.target.value,
								error: readOnly || !onValidate ? prevState.error : onValidate(e.target.value).error,
								message: readOnly || !onValidate ? prevState.message : onValidate(e.target.value).message,
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
