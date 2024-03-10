// Utils Validators
import fetchServer from './../utils/fetchServer.js';
import validators from './../utils/validators.js';
const { validateName, validateEmail, validatePassword } = validators;

const baseUrl = '/api/v1/auth/';

const authenticateUser = async (auth, state, dispatch, login, navigate, e) => {
	if (e) e.preventDefault();
	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);
	let nameStatus = null;
	if (auth === 'register') nameStatus = validateName(state.nameField.value);

	if (emailStatus.error || passwordStatus.error || (nameStatus && nameStatus.error)) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		let user = { email: state.emailField.value, password: state.passwordField.value };
		if (auth === 'register') user = { ...user, name: state.nameField.value };
		await fetchServer(auth, `${baseUrl}/${auth}`, 'POST', null, user, dispatch, null, null, navigate, login, null, null);
	}
};

const controller = { authenticateUser };

export default controller;
