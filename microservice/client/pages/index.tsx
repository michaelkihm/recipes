import type { NextPage } from 'next';
import buildAxiosClient from '../api/build-client';
import { UserDoc } from '@mickenhosrecipes/common';

type CurrentUser = {
	currentUser: UserDoc | null;
};

const Home: NextPage<CurrentUser> = ({ currentUser }) => {
	
	return (
		<div>
			<h1>Landing Page</h1>
			{currentUser && <p>Hello {currentUser.username}</p>}
		</div>);
};


Home.getInitialProps = async (context): Promise<CurrentUser> => {

	const client = buildAxiosClient(context);
	const { data } = await client.get<CurrentUser>('/api/users/currentuser');
	return data;
};

export default Home;
