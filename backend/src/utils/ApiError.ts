interface ApiErrorInterface {
	status: number;
	message: string;
}

class ApiError extends Error implements ApiErrorInterface {
	status: number;
	message: string;

	constructor(status: number, message: string) {
		super();
		this.status = status;
		this.message = message;
	}
}

export default ApiError;
