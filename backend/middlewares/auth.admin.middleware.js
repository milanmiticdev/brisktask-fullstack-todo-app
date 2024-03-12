// Utils
import routeProtection from './../utils/middlewareUtils/routeProtection.js';

const middleware = (req, res, next) => {
	routeProtection(req, next, 'admin');
};

export default middleware;
