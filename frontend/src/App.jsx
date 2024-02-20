// React
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import AuthContext from './contexts/AuthContext.js';

// Pages
import AppSharedLayout from './pages/AppSharedLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import SingleTaskPage from './pages/SingleTaskPage.jsx';
// import AllTasksPage from './pages/AllTasksPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import UpdateTaskPage from './pages/UpdateTaskPage.jsx';
//import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
// import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

const App = () => {
	const login = () => {
		console.log('login');
	};

	const logout = () => {
		console.log('logout');
	};

	return (
		<AuthContext.Provider
			value={{
				login: login,
				logout: logout,
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<AppSharedLayout />}>
						<Route path="/tasks/update/:taskId" element={<UpdateTaskPage />} />
						<Route path="/tasks/create" element={<CreateTaskPage />} />
						<Route path="/tasks/:taskId" element={<SingleTaskPage />} />
						<Route path="/tasks" element={<TasksPage />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route index element={<HomePage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

export default App;
