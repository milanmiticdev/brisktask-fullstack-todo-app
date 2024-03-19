export interface Validation {
	error: boolean;
	message: string;
}

export interface ValidateInputsType {
	nameStatus: Validation;
	emailStatus: Validation;
	passwordStatus: Validation;
	confirmPasswordStatus: Validation;
	roleStatus: Validation;
}
