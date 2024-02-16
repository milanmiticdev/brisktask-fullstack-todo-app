import ApiError from './../utils/ApiError.js';

const middleware = (error, req, res, next) => {
	if (error instanceof ApiError) {
		return res.status(error.status).json({ message: error.message, status: error.status });
	} else {
		return res.status(500).json({ message: 'Something went wrong.', status: 500 });
	}
};

export default middleware;
