// Utils Validators
import fetchServer from '../utils/fetchServer';
import validators from '../utils/validators';
const { validateName, validateEmail, validatePassword } = validators;

// Types
import type { AuthenticateUserController } from './../types/controller.types';
import type { AuthenticateUser } from './../types/request.body.types';
import type { AuthUserType } from '../types/server.types';
import type { Validation } from './../types/util.types';

const baseUrl: string = '/api/v1/auth/';

const authenticateUser = async ({ route, state, dispatch, navigate, login, e }: AuthenticateUserController) => {
	e.preventDefault();
	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);
	let nameStatus: Validation | undefined;

	if (route === 'register') nameStatus = validateName(state.nameField.value);

	if (emailStatus.error || passwordStatus.error || (nameStatus && nameStatus.error)) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		let user: AuthenticateUser = { email: state.emailField.value, password: state.passwordField.value };

		if (route === 'register') user = { ...user, name: state.nameField.value };

		await fetchServer<AuthUserType>({ route, url: `${baseUrl}/${route}`, method: 'POST', body: user, dispatch, navigate, login });
	}
};

const controller = { authenticateUser };

export default controller;
