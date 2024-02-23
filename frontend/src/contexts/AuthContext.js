import { createContext } from 'react';

const AuthContext = createContext({
	userId: null,
	userRole: null,
	token: null,
	login: () => {},
	logout: () => {},
});

export default AuthContext;
