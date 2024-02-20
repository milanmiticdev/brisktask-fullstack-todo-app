// Router
import { Outlet } from 'react-router-dom';

// Components
import Header from '../components/Header.jsx';

const AppSharedLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default AppSharedLayout;
