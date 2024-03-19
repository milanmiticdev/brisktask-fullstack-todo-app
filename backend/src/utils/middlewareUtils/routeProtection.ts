// Express
import { NextFunction } from 'express';

// jsonwebtoken
import jwt, { JwtPayload } from 'jsonwebtoken';

// Utils
import attachUserData from './attachUserData';

// Config
import config from './../../config/config';
const { jwtSecret } = config;

// Custom error
import ApiError from '../ApiError';

// Types
import { ExtendedRequest } from './../../types/request.types';

const routeProtection = (req: ExtendedRequest, next: NextFunction, allow: string) => {
	if (req.method === 'OPTIONS') {
		return next();
	} else {
		try {
			// Spliting 'Bearer TOKEN'
			const token: string | undefined = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;

			if (!token) {
				throw new ApiError(401, 'Not authenticated.');
			} else {
				const decodedToken: JwtPayload | string = jwt.verify(token, jwtSecret);

				if (allow === 'authenticated') {
					attachUserData(req, next, decodedToken);
				}

				if (allow === 'admin') {
					if (typeof decodedToken !== 'string' && decodedToken.userRole === 'admin') {
						attachUserData(req, next, decodedToken);
					} else {
						throw new ApiError(403, 'Not authorized.');
					}
				}
			}
		} catch (error) {
			return next(error);
		}
	}
};

export default routeProtection;
