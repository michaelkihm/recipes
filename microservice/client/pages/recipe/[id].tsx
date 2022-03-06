import { GetServerSideProps, NextPage } from 'next';
import { Recipe } from '@mickenhosrecipes/common';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import BulletPointIcon from '../../components/icons/BulletPointIcon';

interface RecipePageProps {
    recipe: Recipe
}

const RecipePage: NextPage<RecipePageProps> = ({ recipe }) => {

    const { name, image, duration, categories, ingredients, description } = recipe;

    return (
        <div className="h-full flex flex-col gap-y-2 overflow-y-auto scroll-container">
            <h1 className="text-3xl font-mono">{name}</h1>
            <div className="flex gap-x-1">
                <p className="font-bold">Zeit:</p>
                <p>{duration.duration}</p>
                <p>{duration.unit}</p>
            </div>
            {/* {image && <Image src={image} alt={name} width={200} height={200} loader={imageLoader} unoptimized/>} */}
            { image && <img src={image} alt={name} height={'25%'}/>}
            <div className="flex flex-wrap gap-x-1">
                { categories.map(category => (
                    <div key={category}
                        className="min-w-[25%] px-1 py-0.5 flex justify-center items-center rounded-lg bg-chenin">
                            <p className='text-black'>{category}</p>
                    </div>
                ))}
            </div>
            <RecipeThematicBreak name="Zutaten" />
            <ul className="list-inside">
                {ingredients.map(ingredient => (
                    <li key={`${ingredient.name}:${ingredient.amount}`} className="flex items-center gap-x-1">
                        <BulletPointIcon />
                        <p>{ingredient.amount}</p>
                        <p>{ingredient.unit}</p>
                        <p>{ingredient.name}</p>
                    </li>
                ))}
            </ul>

            <RecipeThematicBreak name="Zubereitung" />
            {description.map((step,i) => (
                <div key={i}>
                    <p className="font-bold">Schritt {i + 1}</p>
                    <p>{step}</p>
                </div>
            ))}
        </div>
    );
};


export const getServerSideProps: GetServerSideProps<RecipePageProps> = async (context) => {
    
    const client = buildAxiosBackendClient(context.req.headers);
    const { data } = await client.get<Recipe>(`api/recipes/${context.query.id}`);

    return {
        props: {
          recipe: data,
        },
    };
};

export default RecipePage;