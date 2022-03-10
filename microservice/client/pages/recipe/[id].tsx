import { GetServerSideProps, NextPage } from 'next';
import { Recipe, RecipeUserDetails } from '@mickenhosrecipes/common';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import BulletPointIcon from '../../components/icons/BulletPointIcon';
import RecipeImage from '../../components/RecipeImage';
import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/user-context';
import { updateBookmarksRequest } from '../../api/update-bookmarks';
import BookmarkIcon from '../../components/icons/BookmarkIcon';

interface RecipePageProps {
    recipe: RecipeUserDetails;
    bookmarks: string[];
}

const RecipePage: NextPage<RecipePageProps> = ({ recipe, bookmarks }) => {

    const { name, image, duration, categories, ingredients, description, userId, id } = recipe;
    const [bookmarked, setBookmarked] = useState<boolean>(bookmarks.includes(id));

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        currentUser && updateBookmarksRequest(bookmarked ? 'push' : 'pull', id);
    },[bookmarked])

    return (
        <div className="h-full flex flex-col gap-y-2 overflow-y-auto scroll-container">
            <div className="w-full mb-2 flex justify-between">
                <div className="grow relative">
                    <h1 className="text-3xl font-mono">{name}</h1>
                    <p className="absolute top-6 text-gray-400 font-bold">by {userId.username}</p>
                </div>
                {currentUser && <BookmarkIcon checked={bookmarked} sizeRem={2} onClick={() => setBookmarked(!bookmarked)}/>}
            </div>
            <div className="flex gap-x-1">
                <p className="font-bold">Zeit:</p>
                <p>{duration.duration}</p>
                <p>{duration.unit}</p>
            </div>
            {/* {image && <Image src={image} alt={name} width={200} height={200} loader={imageLoader} unoptimized/>} */}
            { image && <RecipeImage imagePath={image} name={name} categories={categories} className="h-[75%]"/>}
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
    let booksmarksResponse: AxiosResponse<Recipe[], any> | undefined;

    const recipeResponse = await client.get<RecipeUserDetails>(`api/recipes/${context.query.id}`);

    if(Object.keys(context.req.cookies).length) {
        booksmarksResponse = await client.get<Recipe[]>('/api/recipes/bookmarks');
    }

    return {
        props: {
          recipe: recipeResponse.data,
          bookmarks: booksmarksResponse ? booksmarksResponse.data.map(recipe => recipe.id) : [],
        },
    };
};

export default RecipePage;