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
				throw new ApiError(401, 'Forbidden Access - Not authenticated.');
			} else {
				const decodedToken = jwt.verify(token, jwtSecret);

				if (decodedToken.userRole === 'admin') {
					req.userData = {
						id: decodedToken.userId,
						email: decodedToken.userEmail,
						role: decodedToken.userRole,
					};
					return next();
				} else {
					throw new ApiError(403, 'Forbidden Access - Not authorized.');
				}
			}
		} catch (error) {
			return next(error);
		}
	}
};

export default middleware;
