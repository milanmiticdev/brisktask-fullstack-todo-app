// React
import { createContext } from 'react';

// Types
import type { AuthContext } from './../types/context.types';

const AuthContext: React.Context<AuthContext> = createContext<AuthContext>({
	userId: 0,
	userRole: '',
	token: '',
	login: () => {},
	logout: () => {},
});

export default AuthContext;
