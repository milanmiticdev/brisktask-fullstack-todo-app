import validators from './../utils/validators.js';
const { validateName, validateEmail, validatePassword } = validators;

const authenticateUser = async (auth, state, dispatch, login, navigate, e) => {
	if (e) {
		e.preventDefault();
	}

	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);
	let nameStatus = null;

	if (auth === 'register') {
		nameStatus = validateName(state.nameField.value);
	}

	if (emailStatus.error || passwordStatus.error || (nameStatus && nameStatus.error)) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		try {
			let user = {
				email: state.emailField.value,
				password: state.passwordField.value,
			};

			if (auth === 'register') {
				user = { ...user, name: state.nameField.value };
			}

			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: auth === 'login' ? 'Login' : 'Register' });

			const response = await fetch(`/api/v1/auth/${auth}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			});
			const data = await response.json();

			if (data.status === 200 || data.status === 201) {
				login(data.user.id, data.user.role, data.token);
				navigate('/');
			} else {
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

const controller = { authenticateUser };

export default controller;
