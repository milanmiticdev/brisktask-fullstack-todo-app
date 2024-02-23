const validateName = name => {
	if (name && name.trim().length > 0) {
		return {
			error: false,
			message: 'Valid name.',
		};
	} else {
		return {
			error: false,
			message: `Name can't be empty.`,
		};
	}
};

const validateEmail = email => {
	if (email && email.trim().length > 0) {
		// Regular expression = email must be in the valid format
		const regex =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (regex.test(email.trim())) {
			return {
				error: false,
				message: 'Valid email.',
			};
		} else {
			return {
				error: true,
				message: 'Not a valid email address.',
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
	if (password && password.trim().length > 0) {
		return {
			error: false,
			message: 'Valid password.',
		};
	} else {
		return {
			error: true,
			message: `Password can't be empty.`,
		};
	}

	/*
        OPTIONAL: Implementing password regex

        Regular Expression =
            Length 8-255 characters
            At least one lowercase letter
            At least one uppercase letter
            At least one digit 
            At least one special character

        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,255}$/;

        if (regex.test(password.trim())) {
			return {
				error: false,
				message: 'Valid password.',
			};
		} else {
			return {
				error: true,
				message: 'Password length must be 8-255 characters. Must have at least one lowercase letter, one uppercase letter, one digit and one special character.',
			};
		}
    */
};

const validation = { validateName, validateEmail, validatePassword };

export default validation;
