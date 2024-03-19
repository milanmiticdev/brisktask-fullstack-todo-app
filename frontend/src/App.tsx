// React
import { useReducer, useEffect, useCallback, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import AuthContext from './contexts/AuthContext';

// Pages
const AppSharedLayout = lazy(() => import('./pages/shared/AppSharedLayout'));
const Home = lazy(() => import('./pages/shared/Home'));
const PageNotFound = lazy(() => import('./pages/shared/PageNotFound'));
const Tasks = lazy(() => import('./pages/tasks/Tasks'));
const CreateTask = lazy(() => import('./pages/tasks/CreateTask'));
const UpdateTask = lazy(() => import('./pages/tasks/UpdateTask'));
const Auth = lazy(() => import('./pages/users/Auth'));
const Profile = lazy(() => import('./pages/users/Profile'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ViewUser = lazy(() => import('./pages/admin/ViewUser'));
const ViewTask = lazy(() => import('./pages/admin/ViewTask'));
const CreateUser = lazy(() => import('./pages/admin/CreateUser'));

// Types
import type { AppState, AppAction } from './types/page.types';

interface StoredUserData {
	userId: number;
	userRole: string;
	token: string;
	expiration: string;
}

const initialState: AppState = {
	userId: 0,
	userRole: '',
	token: '',
	tokenExpirationDate: null,
};

// Reducer function
const reducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case 'user-id-change':
			return { ...state, userId: action.payload };
		case 'user-role-change':
			return { ...state, userRole: action.payload };
		case 'token-change':
			return { ...state, token: action.payload };
		case 'token-expiration-date-change':
			return { ...state, tokenExpirationDate: action.payload };
	}
};

const App = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const login = useCallback((id: number, role: string, token: string, expirationDate: Date | null): void => {
		dispatch({ type: 'user-id-change', payload: id });
		dispatch({ type: 'user-role-change', payload: role });
		dispatch({ type: 'token-change', payload: token });
		const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
		dispatch({ type: 'token-expiration-date-change', payload: expirationDate });
		localStorage.setItem(
			'userData',
			JSON.stringify({ userId: id, userRole: role, token: token, expiration: tokenExpirationDate.toISOString() })
		);
	}, []);

	const logout = useCallback((): void => {
		dispatch({ type: 'token-change', payload: '' });
		dispatch({ type: 'token-expiration-date-change', payload: null });
		dispatch({ type: 'user-id-change', payload: 0 });
		dispatch({ type: 'user-role-change', payload: '' });
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		const savedData = localStorage.getItem('userData');

		if (typeof savedData === 'string') {
			const storedUserData: StoredUserData = JSON.parse(savedData);
			if (storedUserData && storedUserData.token && new Date(storedUserData.expiration) > new Date()) {
				login(storedUserData.userId, storedUserData.userRole, storedUserData.token, new Date(storedUserData.expiration));
			}
		}
	}, [login]);

	useEffect(() => {
		let remainingTime: number = 0;
		if (state.token && state.tokenExpirationDate) {
			remainingTime = state.tokenExpirationDate.getTime() - new Date().getTime();
		} else {
			clearTimeout(setTimeout(logout, remainingTime));
		}
	}, [state.token, state.tokenExpirationDate, logout]);

	return (
		<AuthContext.Provider value={{ userId: state.userId, userRole: state.userRole, token: state.token, login, logout }}>
			<BrowserRouter>
				{state.token && state.userRole === 'admin' ? (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/dashboard/create-user" element={<CreateUser />} />
							<Route path="/dashboard/users/:userId" element={<ViewUser />} />
							<Route path="/dashboard/tasks/:taskId" element={<ViewTask />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/*" element={<PageNotFound />} />
							<Route index element={<Home />} />
						</Route>
					</Routes>
				) : state.token && state.userRole === 'user' ? (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/tasks" element={<Tasks />} />
							<Route path="/update-task/:taskId" element={<UpdateTask />} />
							<Route path="/create-task" element={<CreateTask />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/*" element={<PageNotFound />} />
							<Route index element={<Home />} />
						</Route>
					</Routes>
				) : (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/auth" element={<Auth />} />
							<Route path="/*" element={<PageNotFound />} />
							<Route index element={<Home />} />
						</Route>
					</Routes>
				)}
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;
