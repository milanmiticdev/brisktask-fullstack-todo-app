// React
import { useReducer, useEffect } from 'react';

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

const FormField = ({
	field,
	type,
	onValidate,
	onDispatch,
	message,
	fieldChange,
	section = '',
	initial = { value: '', error: false, message: '' },
	isUpdating = false,
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

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
		onDispatch({ type: fieldChange, payload: { value: state.field.value, error: state.field.error, message: state.field.message } });
	}, [state.field, fieldChange, onDispatch]);

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
						value={isUpdating ? initial.value : state.field.value}
						onChange={e => {
							const validated = onValidate(e.target.value);
							const change = {
								value: e.target.value,
								error: validated.error,
								message: validated.message,
							};
							isUpdating
								? onDispatch({ type: fieldChange, payload: change })
								: dispatch({ type: 'field-change', payload: change });
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
	fieldChange: PropTypes.string,
	section: PropTypes.string,
	initial: PropTypes.object,
	isUpdating: PropTypes.bool,
};
