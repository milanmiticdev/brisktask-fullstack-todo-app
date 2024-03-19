// Types
import { Validation, ValidateInputsType } from './../types/utility.types';

interface BodyType {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	role?: string;
}

const validateName = (name: string | undefined): Validation => {
	if (name && name.trim().length > 0) {
		return {
			error: false,
			message: 'Valid name.',
		};
	} else {
		return {
			error: true,
			message: 'Name field empty.',
		};
	}
};

const validateEmail = (email: string | undefined): Validation => {
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
				message: 'Email address not valid.',
			};
		}
	} else {
		return {
			error: true,
			message: 'Email field empty.',
		};
	}
};

const validatePassword = (password: string | undefined): Validation => {
	if (password && password.trim().length > 0) {
		return {
			error: false,
			message: 'Valid password.',
		};
	} else {
		return {
			error: true,
			message: 'Password field empty.',
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

const validateRole = (role: string | undefined): Validation => {
	if (role && role.trim().length > 0) {
		if (role.trim() === 'admin' || role.trim() === 'user') {
			return {
				error: false,
				message: 'Valid role.',
			};
		} else {
			return {
				error: true,
				message: 'Invalid user role.',
			};
		}
	} else {
		return {
			error: true,
			message: 'Role field empty.',
		};
	}
};

const validateInputs = (body: BodyType): ValidateInputsType => {
	const { name, email, password, confirmPassword, role } = body;

	const nameStatus = validateName(name);
	const emailStatus = validateEmail(email);
	const passwordStatus = validatePassword(password);
	const confirmPasswordStatus = validatePassword(confirmPassword);
	const roleStatus = validateRole(role);

	return { nameStatus, emailStatus, passwordStatus, confirmPasswordStatus, roleStatus };
};

const validators = { validateName, validateEmail, validatePassword, validateRole, validateInputs };

export default validators;
