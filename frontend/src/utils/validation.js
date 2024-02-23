const validateName = name => {
	if (name !== undefined && name !== null && name.trim() !== '') {
		return {
			error: false,
			message: '',
		};
	} else {
		return {
			error: true,
			message: `Name can't be empty.`,
		};
	}
};

const validateEmail = email => {
	if (email !== undefined && email !== null && email.trim() !== '') {
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		// Check if the email is in the valid format
		if (!emailRegex.test(email.trim())) {
			return {
				error: true,
				message: 'Not a valid email address.',
			};
		} else {
			return {
				error: false,
				message: '',
			};
		}
	} else {
		return {
			error: true,
			message: `Email can't be empty.`,
		};
	}
};

const validatePassword = password => {
	if (password !== undefined && password !== null && password.trim() !== '') {
		return {
			error: false,
			message: '',
		};
	} else {
		return {
			error: true,
			message: `Password can't be empty.`,
		};
	}
};

const validateUserInput = state => {
	if (!state.nameStatus) {
		if (state.emailStatus.error || state.passwordStatus.error) {
			return null;
		} else {
			return {
				email: state.email,
				password: state.password,
			};
		}
	} else {
		if (state.nameStatus.error || state.emailStatus.error || state.passwordStatus.error) {
			return null;
		} else {
			return {
				name: state.name,
				email: state.email,
				password: state.password,
			};
		}
	}
};

const validation = { validateName, validateEmail, validatePassword, validateUserInput };

export default validation;
