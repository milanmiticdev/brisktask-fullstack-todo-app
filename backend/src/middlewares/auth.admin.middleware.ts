// Express
import { Response, NextFunction } from 'express';

// Utils
import routeProtection from '../utils/middlewareUtils/routeProtection';

// Types
import { ExtendedRequest } from './../types/request.types';

const middleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
	routeProtection(req, next, 'admin');
};

export default middleware;
