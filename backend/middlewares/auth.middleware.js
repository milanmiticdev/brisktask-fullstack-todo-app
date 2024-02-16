// Config
import config from './../config/config.js';
const { jwtSecret } = config;

const middleware = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		next();
	} else {
		try {
			// Spliting 'Bearer TOKEN'
			const token = req.headers.authorization.split(' ')[1];

			if (!token) {
				throw new ApiError(401, 'Forbidden Access - Not authorized.');
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
