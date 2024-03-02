// React
import { useReducer } from 'react';

import Modal from './../../components/shared/Modal.jsx';
import Page from './../../components/shared/Page.jsx';

// Initial reducer state
const initialState = {
	modal: {
		open: true,
		error: true,
		message: '404 - Page not found.',
	},
};

// Reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const PageNotFound = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return <Page>{state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}</Page>;
};

export default PageNotFound;
