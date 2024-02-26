// React
import { useState, useReducer, useEffect } from 'react';

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
	value: '',
	initialEmptyState: true,
	status: {
		error: true,
		message: '',
	},
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case 'value-change':
			return { ...state, value: action.payload };
		case 'initial-empty-state-change':
			return { ...state, initialEmptyState: action.payload };
		case 'status-change':
			return { ...state, status: action.payload };
	}
};

const FormField = ({ htmlFor, type, id, name, fieldChangeType, statusChangeType, onValidate, onDispatch, message }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const handlePasswordVisibility = () => {
		setPasswordVisibility(!passwordVisibility);
	};

	useEffect(() => {
		onDispatch({ type: fieldChangeType, payload: state.value });
		if (!state.initialEmptyState) {
			onDispatch({ type: statusChangeType, payload: state.status });
		}
	}, [state.value, state.status, state.initialEmptyState, onDispatch, fieldChangeType, statusChangeType]);

	return (
		<div className={styles.formField}>
			<div className={styles.inputBlock}>
				<label htmlFor={htmlFor} className={styles.label}>
					{name.charAt(0).toUpperCase() + name.slice(1)}
				</label>
				<div className={styles.inputField}>
					<input
						className={styles.input}
						type={passwordVisibility ? 'text' : type}
						id={id}
						name={name}
						value={state.value}
						onChange={e => {
							dispatch({ type: 'value-change', payload: e.target.value });
							dispatch({ type: 'status-change', payload: onValidate(e.target.value) });
							dispatch({ type: 'initial-empty-state-change', payload: false });
						}}
					/>
					{type === 'password' && (
						<div className={styles.icon}>
							{passwordVisibility ? (
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
	htmlFor: PropTypes.string,
	type: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	fieldChangeType: PropTypes.string,
	statusChangeType: PropTypes.string,
	onValidate: PropTypes.func,
	onDispatch: PropTypes.func,
	message: PropTypes.string,
};
