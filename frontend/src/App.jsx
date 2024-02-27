// React
import { useReducer, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import AuthContext from './contexts/AuthContext.js';

// Pages
import AppSharedLayout from './pages/AppSharedLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import UpdateTaskPage from './pages/UpdateTaskPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

const initialState = {
	userId: null,
	userRole: null,
	token: null,
	tokenExpirationDate: null,
};

// Reducer function
const reducer = (state, action) => {
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

let logoutTimer;

const App = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const login = useCallback((id, role, token, expirationDate) => {
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

	const logout = useCallback(() => {
		dispatch({ type: 'token-change', payload: null });
		dispatch({ type: 'token-expiration-date-change', payload: null });
		dispatch({ type: 'user-id-change', payload: null });
		dispatch({ type: 'user-role-change', payload: null });
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));

		if (storedUserData && storedUserData.token && new Date(storedUserData.expiration) > new Date()) {
			login(storedUserData.userId, storedUserData.userRole, storedUserData.token, new Date(storedUserData.expiration));
		}
	}, [login]);

	useEffect(() => {
		if (state.token && state.tokenExpirationDate) {
			const remainingTime = state.tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [state.token, state.tokenExpirationDate, logout]);

	return (
		<AuthContext.Provider value={{ userId: state.userId, userRole: state.userRole, token: state.token, login, logout }}>
			<BrowserRouter>
				{state.token && state.userRole === 'admin' ? (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/update-task/:taskId" element={<UpdateTaskPage />} />
							<Route path="/create-task" element={<CreateTaskPage />} />
							<Route path="/dashboard" element={<AdminDashboardPage />} />
							<Route index element={<HomePage />} />
						</Route>
					</Routes>
				) : state.token && state.userRole === 'user' ? (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/tasks" element={<TasksPage />} />
							<Route path="/update-task/:taskId" element={<UpdateTaskPage />} />
							<Route path="/create-task" element={<CreateTaskPage />} />
							<Route path="/profile" element={<ProfilePage />} />
							<Route index element={<HomePage />} />
						</Route>
					</Routes>
				) : (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/auth" element={<AuthPage />} />
							<Route index element={<HomePage />} />
						</Route>
					</Routes>
				)}
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;
