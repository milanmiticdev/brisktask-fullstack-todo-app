// jsonwebtoken
import jwt from 'jsonwebtoken';

// Utils
import attachUserData from './attachUserData.js';

// Config
import config from './../../config/config.js';
const { jwtSecret } = config;

// Custom error
import ApiError from './../ApiError.js';

const routeProtection = (req, next, allow) => {
	if (req.method === 'OPTIONS') {
		return next();
	} else {
		try {
			// Spliting 'Bearer TOKEN'
			const token = req.headers.authorization.split(' ')[1];

			if (!token) {
				throw new ApiError(401, 'Not authenticated.');
			} else {
				const decodedToken = jwt.verify(token, jwtSecret);

				if (allow === 'authenticated') {
					attachUserData(req, next, decodedToken);
				}

				if (allow === 'admin') {
					if (decodedToken.userRole === 'admin') {
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
