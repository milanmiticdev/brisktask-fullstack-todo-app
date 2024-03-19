export interface UserTaskSharedType {
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface UserType extends UserTaskSharedType {
	email: string;
	password: string;
	role: string;
}

export interface TaskType extends UserTaskSharedType {
	user_id: number;
	user_email: string;
}
