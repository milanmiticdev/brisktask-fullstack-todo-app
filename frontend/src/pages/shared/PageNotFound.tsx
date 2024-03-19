// React
import { useReducer } from 'react';

// Components
import Modal from '../../components/shared/Modal';
import Page from '../../components/shared/Page';

// Types
import type { PageNotFoundState, PageNotFoundAction } from './../../types/page.types';

// Initial reducer state
const initialState: PageNotFoundState = {
	modal: {
		open: true,
		error: true,
		message: '404 - Page not found.',
	},
};

// Reducer function
const reducer = (state: PageNotFoundState, action: PageNotFoundAction): PageNotFoundState => {
	switch (action.type) {
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const PageNotFound = (): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return <Page center={true}>{state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}</Page>;
};

export default PageNotFound;
