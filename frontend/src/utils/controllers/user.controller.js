const getAllUsers = async (token, dispatch) => {
	try {
		dispatch({ type: 'is-loading', payload: true });
		dispatch({ type: 'spinner-text-change', payload: 'Loading' });

		const response = await fetch('http://localhost:5174/api/v1/users', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: null,
		});
		const data = await response.json();

		if (data.status === 200) {
			dispatch({ type: 'result-fetched', payload: data.users });
		} else {
			dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: data.message } });
		}
	} catch {
		dispatch({ type: 'modal-change', payload: { isOpen: true, error: true, message: 'Something went wrong.' } });
	} finally {
		dispatch({ type: 'is-loading', payload: false });
		dispatch({ type: 'spinner-text-change', payload: '' });
		dispatch({ type: 'is-selecting', payload: false });
	}
};

const controller = { getAllUsers };

export default controller;
