// Components
import Page from '../../components/shared/Page.jsx';
import PulseEffect from '../../components/shared/PulseEffect.jsx';

const Home = () => {
	return (
		<Page loading={true}>
			<PulseEffect text="Welcome" />
		</Page>
	);
};

export default Home;
