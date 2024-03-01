// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import Form from './../components/Form.jsx';
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';

// Controllers
import userController from './../controllers/user.controller.js';

// Utils
import validators from '../utils/validators.js';
import UTCtoLocal from './../utils/UTCtoLocal.js';

// Styles
import styles from './AdminUserViewPage.module.css';

// Initial reducer state
const initialState = {
	result: {},
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	emailField: {
		value: '',
		error: false,
		message: '',
	},
	roleField: {
		value: '',
		error: false,
		message: '',
	},
	passwordField: {
		value: '',
		error: false,
		message: '',
	},
	confirmPasswordField: {
		value: '',
		error: false,
		message: '',
	},
	loading: false,
	error: false,
	editing: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state, action) => {
	switch (action.type) {
		case 'result-change':
			return { ...state, result: action.payload };
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'email-field-change':
			return { ...state, emailField: action.payload };
		case 'role-field-change':
			return { ...state, roleField: action.payload };
		case 'password-field-change':
			return { ...state, passwordField: action.payload };
		case 'confirm-password-field-change':
			return { ...state, confirmPasswordField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'error-change':
			return { ...state, error: action.payload };
		case 'editing-change':
			return { ...state, editing: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AdminUserViewPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userRole, token, login, logout } = useContext(AuthContext);
	const { userId } = useParams();
	const navigate = useNavigate();

	const { getUserById, updateUserById, deleteUserById, changePassword } = userController;
	const { validateName, validateEmail, validatePassword, validateRole } = validators;

	const handleEditBtn = () => dispatch({ type: 'editing-change', payload: true });
	const handleCancelBtn = () => dispatch({ type: 'editing-change', payload: false });
	const handleUpdateUserById = async e => await updateUserById(userId, userRole, token, state, dispatch, login, navigate, e);
	const handleDeleteUserById = async e => await deleteUserById(userId, userRole, token, dispatch, logout, navigate, e);
	const handleChangePassword = async e => await changePassword(userId, token, state, dispatch, e);

	useEffect(() => {
		const handleGetUserById = async () => await getUserById(userId, token, dispatch);
		handleGetUserById();
	}, [userId, token, getUserById]);

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.user}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && Object.keys(state.result).length > 0 && (
				<>
					<section className={styles.section}>
						<Form onSubmit={handleUpdateUserById}>
							<h2 className={styles.heading}>USER INFO</h2>
							<FormField
								name="name"
								type="text"
								initial={state.result.name}
								fieldChange="name-field-change"
								onDispatch={dispatch}
								onValidate={validateName}
								readOnly={state.editing ? false : true}
								autoFocus={false}
							/>
							<FormField
								name="email"
								type="text"
								initial={state.result.email}
								fieldChange="email-field-change"
								onDispatch={dispatch}
								onValidate={validateEmail}
								readOnly={state.editing ? false : true}
								autoFocus={false}
							/>
							<FormField
								name="role"
								type="text"
								initial={state.result.role}
								fieldChange="role-field-change"
								onDispatch={dispatch}
								onValidate={validateRole}
								readOnly={state.editing ? false : true}
								autoFocus={false}
							/>
							<FormField
								name="created"
								type="text"
								initial={`${UTCtoLocal(state.result.createdAt).date} ${UTCtoLocal(state.result.createdAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							<div className={styles.formBtns}>
								{!state.editing && <FormBtn text="EDIT" type="button" color="gray" onClick={handleEditBtn} />}
								{state.editing && (
									<>
										<FormBtn text="SAVE" type="submit" color="blue" />
										<FormBtn text="X" type="button" color="red" onClick={handleCancelBtn} />
									</>
								)}
							</div>
						</Form>
					</section>
					<section className={styles.section}>
						<Form onSubmit={handleChangePassword}>
							<h2 className={styles.heading}>CHANGE PASSWORD</h2>
							<FormField
								name="password"
								type="password"
								fieldChange="password-field-change"
								onDispatch={dispatch}
								onValidate={validatePassword}
								readOnly={false}
								autoFocus={false}
							/>
							<FormField
								name="confirm password"
								type="password"
								fieldChange="confirm-password-field-change"
								onDispatch={dispatch}
								onValidate={validatePassword}
								readOnly={false}
								autoFocus={false}
							/>
							<FormBtn text="CHANGE" type="submit" color="blue" />
						</Form>
					</section>
					<section className={styles.section}>
						<Form onSubmit={handleDeleteUserById}>
							<h2 className={styles.heading}>DELETE ACCOUNT</h2>
							<FormBtn text="DELETE" type="submit" color="red" />
						</Form>
					</section>
				</>
			)}
		</main>
	);
};

export default AdminUserViewPage;
