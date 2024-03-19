// Components
import Page from '../../components/shared/Page';
import PulseEffect from '../../components/shared/PulseEffect';

const Home = (): JSX.Element => {
	return (
		<Page center={true}>
			<PulseEffect text="Welcome" />
		</Page>
	);
};

export default Home;
