// React
import { useReducer, useEffect, useContext, FormEvent } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../../contexts/AuthContext';

// Components
import Button from './../../components/shared/Button';
import Form from './../../components/shared/Form';
import FormButtons from './../../components/shared/FormButtons';
import FormField from './../../components/shared/FormField';
import Modal from './../../components/shared/Modal';
import Page from './../../components/shared/Page';
import Section from './../../components/shared/Section';
import Spinner from './../../components/shared/Spinner';

// Controllers
import userController from './../../controllers/user.controller';

// Utils
import validators from '../../utils/validators';

// Types
import type { UserType } from '../../types/server.types';
import type { ProfilePageState, ProfilePageAction } from './../../types/page.types';

// Initial reducer state
const initialState: ProfilePageState = {
	result: {} as UserType,
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
	editing: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state: ProfilePageState, action: ProfilePageAction): ProfilePageState => {
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

	const handleEditBtn = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: true });
	};
	const handleCancelBtn = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: false });
	};

	const handleUpdateUserById = async (e: FormEvent<HTMLFormElement>) =>
		await updateUserById({ userId, userRole, token, state, dispatch, login, navigate, e });
	const handleDeleteUserById = async (e: FormEvent<HTMLFormElement>) =>
		await deleteUserById({ userId, userRole, token, dispatch, logout, navigate, e });
	const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => await changePassword({ userId, token, state, dispatch, e });

	useEffect(() => {
		const handleGetUserById = async () => await getUserById({ userId, token, dispatch });
		handleGetUserById();
	}, [userId, token, getUserById]);

	return (
		<Page center={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && state.result && Object.keys(state.result).length > 0 && (
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
								<FormButtons>
									<Button text="SAVE" type="submit" color="blue" />
									<Button text="X" type="button" color="red" onClick={handleCancelBtn} />
								</FormButtons>
							) : (
								<Button text="EDIT" type="button" color="gray" onClick={handleEditBtn} />
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
							<Button text="CHANGE" type="submit" color="blue" />
						</Form>
					</Section>
					<Section>
						<Form onSubmit={handleDeleteUserById} heading="DELETE ACCOUNT">
							<Button text="DELETE" type="submit" color="red" />
						</Form>
					</Section>
				</>
			)}
		</Page>
	);
};

export default ProfilePage;
