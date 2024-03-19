// Types
import type { UserType, TaskType } from './server.types';

export type Field = {
	value: string;
	error: boolean;
	message: string;
};

export type Modal = {
	open: boolean;
	error: boolean;
	message: string;
};

export type SharedReducerState = {
	loading: boolean;
	spinner: string;
	modal: Modal;
};

export type AppState = {
	userId: number;
	userRole: string;
	token: string;
	tokenExpirationDate: Date | null;
};

export type AppAction =
	| { type: 'user-id-change'; payload: number }
	| { type: 'user-role-change'; payload: string }
	| { type: 'token-change'; payload: string }
	| { type: 'token-expiration-date-change'; payload: Date | null };

export type AuthPageState = SharedReducerState & {
	nameField: Field;
	emailField: Field;
	passwordField: Field;
	section: string;
};

export type AuthPageAction =
	| { type: 'name-field-change'; payload: Field }
	| { type: 'email-field-change'; payload: Field }
	| { type: 'password-field-change'; payload: Field }
	| { type: 'section-change'; payload: string }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type CreateTaskPageState = SharedReducerState & {
	nameField: Field;
};

export type CreateTaskPageAction =
	| { type: 'name-field-change'; payload: Field }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type CreateUserPageState = SharedReducerState & {
	nameField: Field;
	emailField: Field;
	passwordField: Field;
	roleField: Field;
};

export type CreateUserPageAction =
	| { type: 'name-field-change'; payload: Field }
	| { type: 'email-field-change'; payload: Field }
	| { type: 'password-field-change'; payload: Field }
	| { type: 'role-field-change'; payload: Field }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type DashboardPageState = SharedReducerState & {
	result: null | UserType | UserType[] | TaskType | TaskType[];
	idForUserById: number;
	idForTaskById: number;
	idForTasksByUserId: number;
	selecting: boolean;
};

export type DashboardPageAction =
	| { type: 'result-change'; payload: null | UserType | UserType[] | TaskType | TaskType[] }
	| { type: 'id-for-user-by-id-change'; payload: number }
	| { type: 'id-for-task-by-id-change'; payload: number }
	| { type: 'id-for-tasks-by-user-id-change'; payload: number }
	| { type: 'selecting-change'; payload: boolean }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type PageNotFoundState = {
	modal: Modal;
};

export type PageNotFoundAction = { type: 'modal-change'; payload: Modal };

export type ProfilePageState = SharedReducerState & {
	result: UserType;
	nameField: Field;
	emailField: Field;
	passwordField: Field;
	confirmPasswordField: Field;
	editing: boolean;
};

export type ProfilePageAction =
	| { type: 'result-change'; payload: UserType }
	| { type: 'name-field-change'; payload: Field }
	| { type: 'email-field-change'; payload: Field }
	| { type: 'password-field-change'; payload: Field }
	| { type: 'confirm-password-field-change'; payload: Field }
	| { type: 'editing-change'; payload: boolean }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type TasksPageState = SharedReducerState & {
	result: TaskType[];
};

export type TasksPageAction =
	| { type: 'result-change'; payload: TaskType[] }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type UpdateTaskPageState = SharedReducerState & {
	result: TaskType;
	nameField: Field;
};

export type UpdateTaskPageAction =
	| { type: 'result-change'; payload: TaskType }
	| { type: 'name-field-change'; payload: Field }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type ViewTaskPageState = SharedReducerState & {
	result: TaskType;
	nameField: Field;
	editing: boolean;
};

export type ViewTaskPageAction =
	| { type: 'result-change'; payload: TaskType }
	| { type: 'name-field-change'; payload: Field }
	| { type: 'editing-change'; payload: boolean }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };

export type ViewUserPageState = SharedReducerState & {
	result: UserType;
	nameField: Field;
	emailField: Field;
	roleField: Field;
	passwordField: Field;
	confirmPasswordField: Field;
	editing: boolean;
};

export type ViewUserPageAction =
	| { type: 'result-change'; payload: UserType }
	| { type: 'name-field-change'; payload: Field }
	| { type: 'email-field-change'; payload: Field }
	| { type: 'role-field-change'; payload: Field }
	| { type: 'password-field-change'; payload: Field }
	| { type: 'confirm-password-field-change'; payload: Field }
	| { type: 'editing-change'; payload: boolean }
	| { type: 'loading-change'; payload: boolean }
	| { type: 'spinner-change'; payload: string }
	| { type: 'modal-change'; payload: Modal };
