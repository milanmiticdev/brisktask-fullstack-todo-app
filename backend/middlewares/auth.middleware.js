// jsonwebtoken
import jwt from 'jsonwebtoken';

// Config
import config from './../config/config.js';
const { jwtSecret } = config;

// Custom error
import ApiError from './../utils/ApiError.js';

const middleware = (req, res, next) => {
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

				req.userData = {
					id: decodedToken.userId,
					email: decodedToken.userEmail,
					role: decodedToken.userRole,
				};

				return next();
			}
		} catch (error) {
			return next(error);
		}
	}
};

export default middleware;
