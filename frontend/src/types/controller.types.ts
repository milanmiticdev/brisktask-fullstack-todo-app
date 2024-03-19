//React
import { Dispatch, FormEvent } from 'react';

// React Router
import { NavigateFunction } from 'react-router-dom';

// Types
import type {
	AuthPageState,
	CreateUserPageState,
	CreateTaskPageState,
	UpdateTaskPageState,
	ProfilePageState,
	ViewUserPageState,
	ViewTaskPageState,
} from './page.types';

// Auth Controller
export interface AuthenticateUserController {
	route: string;
	state: AuthPageState;
	dispatch: Dispatch<any>;
	login: (id: number, role: string, token: string, expirationDate: Date | null) => void;
	navigate: NavigateFunction;
	e: FormEvent<HTMLFormElement>;
}

// Shared Controllers

export interface ControllerAll {
	token: string;
	dispatch: Dispatch<any>;
	e?: FormEvent<HTMLFormElement>;
}

export interface ControllerCreate extends ControllerAll {
	navigate: NavigateFunction;
}

export interface ControllerUpdateDelete extends ControllerAll {
	userRole: string;
	navigate: NavigateFunction;
}

// User Controllers

export interface GetByUserId extends ControllerAll {
	userId: number;
}

export interface CreateUser extends ControllerCreate {
	state: CreateUserPageState;
}

export interface UpdateUserById extends ControllerUpdateDelete {
	userId: number;
	state: ProfilePageState | ViewUserPageState;
	login: (id: number, role: string, token: string, expirationDate: Date | null) => void;
}

export interface DeleteUserById extends ControllerUpdateDelete {
	userId: number;
	logout: () => void;
}

export interface ChangePassword extends ControllerAll {
	userId: number;
	state: ProfilePageState | ViewUserPageState;
}

// Task Controllers

export interface GetByTaskId extends ControllerAll {
	taskId: number;
}

export interface CreateTask extends ControllerCreate {
	userId: number;
	state: CreateTaskPageState;
}

export interface UpdateTaskById extends ControllerUpdateDelete {
	taskId: number;
	state: UpdateTaskPageState | ViewTaskPageState;
}

export interface DeleteTaskById extends ControllerUpdateDelete {
	taskId: number;
}
