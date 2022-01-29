import type { NextPage } from 'next';


const Home: NextPage = () => {
	
	return (
		<div>
			<h1>Landing Page</h1>
		</div>);
};


// Home.getInitialProps = async (context): Promise<CurrentUser> => {

// 	//const client = buildAxiosClient(context);
// 	const { data } = await client.get<CurrentUser>('/api/users/currentuser');
// 	return data;
// };

export default Home;
