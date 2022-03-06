import type { GetServerSideProps, NextPage } from 'next';
import { Recipe } from '@mickenhosrecipes/common';
import RecipeCard from '../components/RecipeCard';
import { buildAxiosBackendClient } from '../api/server-side-axios-client';

interface HomeProps {
	recipes: Recipe[]
}

const Home: NextPage<HomeProps> = ({ recipes }) => {
	
	return (
		<div className="h-full overflow-y-auto scroll-container">
			{!recipes.length && <p>No recipes are here</p>}
			{recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe}/>)}
		</div>);
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    
    const client = buildAxiosBackendClient(context.req.headers);
    const { data } = await client.get<Recipe[]>('api/recipes');

    return {
        props: {
          recipes: data,
        },
    };
};

export default Home;
