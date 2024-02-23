// React
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import AuthContext from './contexts/AuthContext.js';

// Pages
import AppSharedLayout from './pages/AppSharedLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import AllTasksPage from './pages/AllTasksPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import UpdateTaskPage from './pages/UpdateTaskPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

let logoutTimer;

const App = () => {
	const [userId, setUserId] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const [token, setToken] = useState(null);
	const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

	const login = useCallback((id, role, token, expirationDate) => {
		setUserId(id);
		setUserRole(role);
		setToken(token);
		const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		localStorage.setItem(
			'userData',
			JSON.stringify({ userId: id, userRole: role, token: token, expiration: tokenExpirationDate.toISOString() })
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		setUserRole(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));

		if (storedUserData && storedUserData.token && new Date(storedUserData.expiration) > new Date()) {
			login(storedUserData.userId, storedUserData.userRole, storedUserData.token, new Date(storedUserData.expiration));
		}
	}, [login]);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	return (
		<AuthContext.Provider
			value={{
				userId: userId,
				userRole: userRole,
				token: token,
				login: login,
				logout: logout,
			}}
		>
			<BrowserRouter>
				{token && userRole === 'admin' ? (
					<Routes>
						<Route path="/" element={<AppSharedLayout />}>
							<Route path="/tasks/all" element={<AllTasksPage />} />
							<Route path="/update-task/:taskId" element={<UpdateTaskPage />} />
							<Route path="/create-task" element={<CreateTaskPage />} />
							<Route path="/dashboard" element={<AdminDashboardPage />} />
							<Route path="/profile" element={<ProfilePage />} />
							<Route index element={<HomePage />} />
						</Route>
					</Routes>
				) : token && userRole === 'user' ? (
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
