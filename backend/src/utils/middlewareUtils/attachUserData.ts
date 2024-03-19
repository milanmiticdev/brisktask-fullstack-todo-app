// Express
import { NextFunction } from 'express';

// jsonwebtoken
import { JwtPayload } from 'jsonwebtoken';

// Types
import { ExtendedRequest } from './../../types/request.types';

const attachUserData = (req: ExtendedRequest, next: NextFunction, decodedToken: JwtPayload | string) => {
	if (typeof decodedToken !== 'string') {
		req.userData = { id: decodedToken.userId, email: decodedToken.userEmail, role: decodedToken.userRole };
		return next();
	}
};

export default attachUserData;
