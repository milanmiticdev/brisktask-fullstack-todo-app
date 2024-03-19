// React
import { Suspense } from 'react';

// Router
import { Outlet } from 'react-router-dom';

// Components
import Header from '../../components/shared/Header';
import Page from '../../components/shared/Page';
import Spinner from '../../components/shared/Spinner';

const AppSharedLayout = (): JSX.Element => {
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
