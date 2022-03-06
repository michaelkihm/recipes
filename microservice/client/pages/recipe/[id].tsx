import { GetServerSideProps, NextPage } from 'next';
import { Recipe } from '@mickenhosrecipes/common';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import Image from 'next/image';
import imageLoader from '../../api/image-loader';

interface RecipePageProps {
    recipe: Recipe
}

const RecipePage: NextPage<RecipePageProps> = ({ recipe }) => {

    const { name, image } = recipe;

    return (
        <div>
            <h1>Hallo Rezept {name}</h1>
            {image && <Image src={image} alt={name} width={200} height={200} loader={imageLoader} unoptimized/>}
        </div>
    );
};

export default RecipePage;

export const getServerSideProps: GetServerSideProps<RecipePageProps> = async (context) => {
    
    const client = buildAxiosBackendClient(context.req.headers);
    const { data } = await client.get<Recipe>(`api/recipes/${context.query.id}`);

    return {
        props: {
          recipe: data,
        },
    };
};