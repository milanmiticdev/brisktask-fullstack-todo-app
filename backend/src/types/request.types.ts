// Express
import { Request } from 'express';

export interface UserDataType {
	id: number;
	email: string;
	role: string;
}

export interface ExtendedRequest extends Request {
	userData?: UserDataType;
}
