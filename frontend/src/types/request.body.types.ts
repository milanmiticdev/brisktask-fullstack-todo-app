export type AuthenticateUser = {
	name?: string;
	email: string;
	password: string;
};

export type CreatedTask = {
	name: string;
};

export type CreatedUser = {
	name: string;
	email: string;
	password: string;
	role: string;
};

export type UpdatedUser = {
	name: string;
	email: string;
	role?: string;
};

export type ChangedPassword = {
	password: string;
	confirmPassword: string;
};
