// React
import { useRef, useReducer, useEffect } from 'react';

// Components
import Message from './Message.jsx';

// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './FormField.module.css';

// PropTypes
import PropTypes from 'prop-types';

// Initial reducer state
const initialState = {
	field: {
		value: '',
		error: false,
		message: '',
	},
	passwordVisibility: false,
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case 'field-change':
			return { ...state, field: action.payload };
		case 'password-visibility-change':
			return { ...state, passwordVisibility: action.payload };
	}
};

const FormField = ({ field, type, onValidate, onDispatch, message, fieldChange, initial, section }) => {
	const initialRef = useRef(initial);
	const [state, dispatch] = useReducer(reducer, initialState);

	console.log(initialRef.current);

	const handlePasswordVisibility = () => {
		dispatch({ type: 'password-visibility-change', payload: !state.passwordVisibility });
	};

	useEffect(() => {
		const reset = {
			value: '',
			error: false,
			message: '',
		};
		dispatch({ type: 'field-change', payload: reset });
	}, [section]);

	useEffect(() => {
		dispatch({ type: 'field-change', payload: { value: initialRef.current, error: false, message: '' } });
	}, [initialRef]);

	return (
		<div className={styles.formField}>
			<div className={styles.inputBlock}>
				<label htmlFor={field} className={styles.label}>
					{field.charAt(0).toUpperCase() + field.slice(1)}
				</label>
				<div className={styles.inputField}>
					<input
						className={styles.input}
						type={state.passwordVisibility ? 'text' : type}
						id={field}
						name={field}
						value={state.field.value}
						onChange={e => {
							const validated = onValidate(e.target.value);
							const change = {
								value: e.target.value,
								error: validated.error,
								message: validated.message,
							};
							dispatch({ type: 'field-change', payload: change });
						}}
					/>
					{type === 'password' && (
						<div className={styles.icon}>
							{state.passwordVisibility ? (
								<FontAwesomeIcon icon={faEyeSlash} onClick={handlePasswordVisibility} />
							) : (
								<FontAwesomeIcon icon={faEye} onClick={handlePasswordVisibility} />
							)}
						</div>
					)}
				</div>
			</div>
			<Message message={message} />
		</div>
	);
};

export default FormField;

FormField.propTypes = {
	field: PropTypes.string,
	type: PropTypes.string,
	onValidate: PropTypes.func,
	onDispatch: PropTypes.func,
	message: PropTypes.string,
	section: PropTypes.string,
	fieldChange: PropTypes.string,
	initial: PropTypes.string,
};
