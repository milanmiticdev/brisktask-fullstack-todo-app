// Router
import { Outlet } from 'react-router-dom';

// Components
import Header from './../../components/shared/Header.jsx';

const AppSharedLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default AppSharedLayout;
