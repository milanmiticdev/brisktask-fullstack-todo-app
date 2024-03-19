export interface AuthUserType {
	readonly userId: number;
	userEmail: string;
	userRole: 'admin' | 'user';
}

export interface TaskType {
	readonly id: number;
	name: string;
	userId: number;
	userEmail: string;
	createdAt: string;
	updatedAt: string;
	section: 'tasks';
}

export interface UserType {
	readonly id: number;
	name: string;
	email: string;
	role: 'admin' | 'user';
	createdAt: string;
	updatedAt: string;
	section: 'users';
}

export type ServerResponse = {
	message: string;
	status: number;
};

export type AuthResponse = ServerResponse & { token: string; result: AuthUserType };

export type UserTaskResponse<T> = ServerResponse & { result: T };
