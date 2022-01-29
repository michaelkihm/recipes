import type { NextPage } from 'next';
import buildAxiosClient from '../api/build-client';
import { Recipe } from '@mickenhosrecipes/common';

interface HomeProps {
	recipes: Recipe[]
}

const Home: NextPage<HomeProps> = ({ recipes }) => {
	
	return (
		<div className='p-2'>
			<h1>Landing Page</h1>
			{!recipes.length && <p>No recipes are here</p>}
			{recipes.map(recipe => <p key={recipe.id}>{recipe.name}</p>)}
		</div>);
};


Home.getInitialProps = async (context): Promise<HomeProps> => {

	const client = buildAxiosClient(context);
	const { data } = await client.get<Recipe[]>('/api/recipes');
	return { recipes: data };
};

export default Home;
