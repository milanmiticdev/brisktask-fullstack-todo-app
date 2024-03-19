// Types
import type { FetchResponseCheck } from './../types/util.types';
import typeCheckers from './type.checkers';
const { hasResultAndEmailField, isAuthResponse, isUserTaskResponse, isUserInfoChanged, isPasswordChanged } = typeCheckers;

const fetchResponseCheck = async <T>({
	response,
	data,
	route,
	method,
	body,
	userId,
	userRole,
	state,
	dispatch,
	navigate,
	login,
	logout,
}: FetchResponseCheck<T>) => {
	if (response) {
		if (response.status === 200) {
			// Processing GET method for all routes
			if (method === 'GET') {
				if (data && (isAuthResponse(data) || isUserTaskResponse(data))) dispatch({ type: 'result-change', payload: data.result });
			} else {
				// Responses coming from USERS route
				if (route === 'users') {
					// If user info changes
					if (body && isUserInfoChanged(body) && body.name && body.email) {
						// Login user and recreate a token if the email changes
						if (
							userRole === 'user' &&
							state &&
							hasResultAndEmailField(state) &&
							state.result.email !== state.emailField.value
						) {
							data &&
								isAuthResponse(data) &&
								data.token &&
								userId &&
								typeof userId === 'number' &&
								login &&
								login(userId, userRole, data.token, null);
						}
						if (navigate) navigate(0);
					}

					// If the password changes
					if (data && body && isPasswordChanged(body) && body.password && body.confirmPassword)
						dispatch({ type: 'modal-change', payload: { open: true, error: false, message: data.message } });
				}

				// Responses coming from TASKS route
				if (route === 'tasks') userRole && userRole === 'admin' ? navigate && navigate(0) : navigate && navigate('/tasks');
			}
		}

		// Processing the 201 status code
		else if (response.status === 201) {
			if (route === 'login' || route === 'register')
				data &&
					isAuthResponse(data) &&
					data.result &&
					data.token &&
					login &&
					login(data.result.userId, data.result.userRole, data.token, null);
			route === 'login' || route === 'register'
				? navigate && navigate('/')
				: route === 'users'
				? navigate && navigate('/dashboard')
				: navigate && navigate('/tasks');
		}

		// Processing the 204 status code
		else if (response.status === 204) {
			// Responses coming from USERS route
			if (route === 'users') {
				if (userRole === 'user') logout && logout();
				if (navigate) userRole === 'admin' ? navigate('/dashboard') : navigate('/');
			}

			// Responses coming from TASKS route
			if (route === 'tasks') {
				if (navigate) userRole === 'admin' ? navigate('/dashboard') : navigate(0);
			}
		}

		// Processing statuses not in the 200 range
		else {
			if (data) dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
		}
	}
};

export default fetchResponseCheck;
