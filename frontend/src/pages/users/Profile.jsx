// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../../contexts/AuthContext.js';

// Components
import Form from './../../components/shared/Form.jsx';
import FormBtn from './../../components/shared/FormBtn.jsx';
import FormBtns from './../../components/shared/FormBtns.jsx';
import FormField from './../../components/shared/FormField.jsx';
import Modal from './../../components/shared/Modal.jsx';
import Page from './../../components/shared/Page.jsx';
import Section from './../../components/shared/Section.jsx';
import Spinner from './../../components/shared/Spinner.jsx';

// Controllers
import userController from './../../controllers/user.controller.js';

// Utils
import validators from './../../utils/validators.js';

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

const ProfilePage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userId, userRole, token, login, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const { getUserById, updateUserById, deleteUserById, changePassword } = userController;
	const { validateName, validateEmail, validatePassword } = validators;

	const handleEditBtn = e => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: true });
	};
	const handleCancelBtn = e => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: false });
	};

	const handleUpdateUserById = async e => await updateUserById(userId, userRole, token, state, dispatch, login, navigate, e);
	const handleDeleteUserById = async e => await deleteUserById(userId, userRole, token, dispatch, logout, navigate, e);
	const handleChangePassword = async e => await changePassword(userId, token, state, dispatch, e);

	useEffect(() => {
		const handleGetUserById = async () => await getUserById(userId, token, dispatch);
		handleGetUserById();
	}, [userId, token, getUserById]);

	return (
		<Page loading={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && Object.keys(state.result).length > 0 && (
				<>
					<Section>
						<Form onSubmit={handleUpdateUserById} heading="PROFILE INFO">
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
							{state.editing ? (
								<FormBtns>
									<FormBtn text="SAVE" type="submit" color="blue" />
									<FormBtn text="X" type="button" color="red" onClick={handleCancelBtn} />
								</FormBtns>
							) : (
								<FormBtn text="EDIT" type="button" color="gray" onClick={handleEditBtn} />
							)}
						</Form>
					</Section>
					<Section>
						<Form onSubmit={handleChangePassword} heading="CHANGE PASSWORD">
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
					</Section>
					<Section>
						<Form onSubmit={handleDeleteUserById} heading="DELETE ACCOUNT">
							<FormBtn text="DELETE" type="submit" color="red" />
						</Form>
					</Section>
				</>
			)}
		</Page>
	);
};

export default ProfilePage;
