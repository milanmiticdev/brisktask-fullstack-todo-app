// React
import { Dispatch } from 'react';

// React Router
import { NavigateFunction } from 'react-router-dom';

// Types
import type { AuthenticateUser, CreatedTask, CreatedUser, UpdatedUser, ChangedPassword } from './request.body.types';
import type { AuthResponse, UserTaskResponse, ServerResponse } from './server.types';
import type { ProfilePageState, ViewUserPageState } from './page.types';

export type DateTime = {
	date: string;
	time: string;
};

export type DateObj = {
	day: number;
	month: number;
	year: number;
};

export type TimeObj = {
	hours: number;
	minutes: number;
	seconds: number;
};

export type Validation = {
	error: boolean;
	message: string;
};

export interface Fetch {
	route: string;
	method: string;
	body?: AuthenticateUser | CreatedTask | CreatedUser | UpdatedUser | ChangedPassword;
	userId?: number;
	userRole?: string;
	state?: ProfilePageState | ViewUserPageState;
	dispatch: Dispatch<any>;
	navigate?: NavigateFunction;
	login?: (id: number, role: string, token: string, expirationDate: Date | null) => void;
	logout?: () => void;
}

export interface FetchServer extends Fetch {
	url: string;
	token?: string;
}

export interface FetchResponseCheck<T> extends Fetch {
	response?: Response;
	data?: AuthResponse | UserTaskResponse<T> | ServerResponse;
}
