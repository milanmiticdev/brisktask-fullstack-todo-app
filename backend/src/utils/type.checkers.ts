// MySQL
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Types
import { UserType, TaskType } from './../types/database.types';

export const isResultUser = (obj: UserType | TaskType | RowDataPacket | ResultSetHeader): obj is UserType => {
	return (
		obj &&
		typeof obj === 'object' &&
		'id' in obj &&
		'name' in obj &&
		'email' in obj &&
		'password' in obj &&
		'role' in obj &&
		'created_at' in obj &&
		'updated_at' in obj
	);
};

export const isResultTask = (obj: UserType | TaskType | RowDataPacket | ResultSetHeader): obj is TaskType => {
	return (
		obj &&
		typeof obj === 'object' &&
		'id' in obj &&
		'name' in obj &&
		'user_id' in obj &&
		'user_email' in obj &&
		'created_at' in obj &&
		'updated_at' in obj
	);
};
