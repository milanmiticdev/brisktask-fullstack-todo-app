// Utils
import fetchResponseCheck from './fetchResponseCheck.js';

const fetchServer = async (route, url, method, token, body, dispatch, userId, userRole, navigate, login, logout, state) => {
	let payload;
	if (method === 'GET') payload = 'Loading';
	else if (method === 'POST') {
		if (route === 'login') payload = 'Login';
		else if (route === 'register') payload = 'Register';
		else payload = 'Creating';
	} else if (method === 'PATCH') payload = 'Updating';
	else payload = 'Deleting';

	let response;
	try {
		dispatch({ type: 'loading-change', payload: true });
		dispatch({ type: 'spinner-change', payload: payload });

		let options = {
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

		let data = null;
		if (method !== 'DELETE') data = await response.json();

		await fetchResponseCheck(response, data, route, method, body, dispatch, userId, userRole, navigate, login, logout, state);
	} catch {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
	} finally {
		if (method === 'GET' || url.includes('change-password') || !response.ok) {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

export default fetchServer;
