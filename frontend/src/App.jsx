// React
import { useReducer, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import AuthContext from './contexts/AuthContext.js';

// Pages
import AppSharedLayout from './pages/shared/AppSharedLayout.jsx';
import Home from './pages/shared/Home.jsx';
import PageNotFound from './pages/shared/PageNotFound.jsx';
import Tasks from './pages/tasks/Tasks.jsx';
import CreateTask from './pages/tasks/CreateTask.jsx';
import UpdateTask from './pages/tasks/UpdateTask.jsx';
import Auth from './pages/users/Auth.jsx';
import Profile from './pages/users/Profile.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ViewUser from './pages/admin/ViewUser.jsx';
import ViewTask from './pages/admin/ViewTask.jsx';
import CreateUser from './pages/admin/CreateUser.jsx';

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
							<Route index element={<Home />} />
						</Route>
					</Routes>
				) : (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/auth" element={<Auth />} />
							<Route index element={<Home />} />
						</Route>
					</Routes>
				)}
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;
