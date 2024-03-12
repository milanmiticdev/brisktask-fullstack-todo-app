// React
import { Suspense } from 'react';

// Router
import { Outlet } from 'react-router-dom';

// Components
import Header from './../../components/shared/Header.jsx';
import Page from './../../components/shared/Page.jsx';
import Spinner from './../../components/shared/Spinner.jsx';

const AppSharedLayout = () => {
	return (
		<>
			<Header />
			<Suspense
				fallback={
					<Page center={true}>
						<Spinner text="Loading" />
					</Page>
				}
			>
				<Outlet />
			</Suspense>
		</>
	);
};

export default AppSharedLayout;
