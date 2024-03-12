const fetchResponseCheck = async (response, data, route, method, body, dispatch, userId, userRole, navigate, login, logout, state) => {
	// Processing the 200 status code
	if (data && data.status === 200) {
		// Processing GET method for all routes
		if (method === 'GET') {
			dispatch({ type: 'result-change', payload: data.result });
		} else {
			// Responses coming from USERS route
			if (route === 'users') {
				// If user info changes
				if (body.name && body.email) {
					// Login user and recreate a token if the email changes
					if (userRole === 'user' && state.result.email !== state.emailField.value) {
						login(userId, userRole, data.token);
					}
					navigate(0);
				}

				// If the password changes
				if (body.password && body.confirmPassword)
					dispatch({ type: 'modal-change', payload: { open: true, error: false, message: data.message } });
			}

			// Responses coming from TASKS route
			if (route === 'tasks') userRole && userRole === 'admin' ? navigate(0) : navigate('/tasks');
		}
	}

	// Processing the 201 status code
	else if (data && data.status === 201) {
		if (route === 'login' || route === 'register') login(data.result.userId, data.result.userRole, data.token);
		route === 'login' || route === 'register' ? navigate('/') : route === 'users' ? navigate('/dashboard') : navigate('/tasks');
	}

	// Processing the 204 status code
	else if (response && response.status === 204) {
		// Responses coming from USERS route
		if (route === 'users') {
			if (userRole === 'user') logout();
			userRole === 'user' ? navigate('/') : navigate('/dashboard');
		}

		// Responses coming from TASKS route
		if (route === 'tasks') userRole === 'admin' ? navigate('/dashboard') : navigate(0);
	}

	// Processing statuses not in the 200 range
	else {
		if (method === 'DELETE') data = await response.json();
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
	}
};

export default fetchResponseCheck;
