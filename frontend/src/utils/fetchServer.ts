// Utils
import fetchResponseCheck from './fetchResponseCheck';

// Types
import type { AuthResponse, UserTaskResponse, ServerResponse } from './../types/server.types';
import type { FetchServer } from './../types/util.types';

const fetchServer = async <T>({
	route,
	url,
	method,
	token,
	body,
	dispatch,
	userId,
	userRole,
	navigate,
	login,
	logout,
	state,
}: FetchServer) => {
	let payload: string = '';
	if (method === 'GET') payload = 'Loading';
	else if (method === 'POST') {
		if (route === 'login') payload = 'Login';
		else if (route === 'register') payload = 'Register';
		else payload = 'Creating';
	} else if (method === 'PATCH') payload = 'Updating';
	else payload = 'Deleting';

	let response: Response | undefined = undefined;
	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: payload });

		let options: RequestInit = {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: body ? JSON.stringify(body) : null,
		};
		if (method === 'POST' || method === 'PATCH') {
			options = { ...options, headers: { ...options.headers, 'Content-Type': 'application/json' } };
		}

		response = await fetch(url, options);

		let data: AuthResponse | UserTaskResponse<T> | ServerResponse | undefined = undefined;
		if (response.status !== 204) data = await response.json();

		await fetchResponseCheck<T>({ response, data, route, method, body, userId, userRole, state, dispatch, navigate, login, logout });
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		if (method === 'GET' || url.includes('change-password') || (response && !response.ok)) {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

export default fetchServer;
