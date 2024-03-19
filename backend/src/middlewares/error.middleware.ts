// Express
import { Response, NextFunction } from 'express';

// Custom error
import ApiError from '../utils/ApiError';

// Types
import { ExtendedRequest } from './../types/request.types';

const middleware = (error: unknown, req: ExtendedRequest, res: Response, next: NextFunction) => {
	if (error instanceof ApiError) {
		return res.status(error.status).json({ message: error.message, status: error.status });
	} else {
		return res.status(500).json({ message: 'Something went wrong.', status: 500 });
	}
};

export default middleware;
