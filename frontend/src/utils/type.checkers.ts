// Types
import type { AuthResponse, UserTaskResponse, ServerResponse } from '../types/server.types';
import type { ProfilePageState, ViewUserPageState } from './../types/page.types';
import type { AuthenticateUser, CreatedTask, CreatedUser, UpdatedUser, ChangedPassword } from './../types/request.body.types';

const hasRoleField = (obj: ProfilePageState | ViewUserPageState): obj is ViewUserPageState => {
	return obj && typeof obj === 'object' && 'roleField' in obj;
};

const hasResultAndEmailField = (obj: ProfilePageState | ViewUserPageState): obj is ProfilePageState | ViewUserPageState => {
	return obj && typeof obj === 'object' && 'result' in obj && 'emailField' in obj;
};

const isServerResponse = <T>(obj: AuthResponse | UserTaskResponse<T> | ServerResponse): obj is ServerResponse => {
	return obj && typeof obj === 'object' && 'status' in obj && 'message' in obj;
};

const isAuthResponse = <T>(obj: AuthResponse | UserTaskResponse<T> | ServerResponse): obj is AuthResponse => {
	return obj && typeof obj === 'object' && 'status' in obj && 'message' in obj && 'token' in obj && 'result' in obj;
};

const isUserTaskResponse = <T>(obj: AuthResponse | UserTaskResponse<T> | ServerResponse): obj is UserTaskResponse<T> => {
	return obj && typeof obj === 'object' && 'status' in obj && 'message' in obj && 'result' in obj;
};

const isUserInfoChanged = (obj: AuthenticateUser | CreatedTask | CreatedUser | UpdatedUser | ChangedPassword): obj is UpdatedUser => {
	return obj && typeof obj === 'object' && 'name' in obj && 'email' in obj;
};

const isPasswordChanged = (obj: AuthenticateUser | CreatedTask | CreatedUser | UpdatedUser | ChangedPassword): obj is ChangedPassword => {
	return obj && typeof obj === 'object' && 'password' in obj && 'confirmPassword' in obj;
};

const typeCheckers = {
	hasRoleField,
	hasResultAndEmailField,
	isServerResponse,
	isAuthResponse,
	isUserTaskResponse,
	isUserInfoChanged,
	isPasswordChanged,
};

export default typeCheckers;
