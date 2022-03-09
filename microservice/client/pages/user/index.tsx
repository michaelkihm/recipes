import { Recipe } from '@mickenhosrecipes/common';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { FunctionComponent, useContext } from 'react';
import imageLoader from '../../api/image-loader';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import RecipeListElement from '../../components/RecipeListElement';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import UserContext from '../../context/user-context';

interface UserPageProps {
    booksmarks: Recipe[];
    recipes: Recipe[];
}
const UserPage: FunctionComponent<UserPageProps> = ({ booksmarks, recipes }) => {

    const { currentUser } = useContext(UserContext);

    if(!currentUser) return <p className="p-2 bg-danger">Kein Benutzer eingeloggt</p>;

    return (
        <div className='flex flex-col '>
            {currentUser.image &&
                <div className='w-1/3 drop-shadow-lg'>
                    <Image
                        src={currentUser.image}
                        alt={currentUser.username}
                        width={200} height={200}
                        loader={imageLoader} unoptimized/>
                </div>}
            <p>{currentUser.username}</p>

            <RecipeThematicBreak name="Rezepteliste"/>
            <div className="my-2 flex flex-col gap-y-2">
                {!booksmarks.length && <p>Keine Rezepte hier...</p>}
                {booksmarks.map(recipe => <RecipeListElement recipe={recipe} key={recipe.id}/>)}
            </div>
            
            <RecipeThematicBreak name="Meine Rezepte"/>
            <div className="my-2 flex flex-col gap-y-2">
                {!recipes.length && <p>Keine Rezepte hier...</p>}
                {recipes.map(recipe =><RecipeListElement recipe={recipe} key={recipe.id}/>)}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {

    const client = buildAxiosBackendClient(context.req.headers);
    let booksmarksResponse: AxiosResponse<Recipe[], any> | undefined;
    let recipesResponse: AxiosResponse<Recipe[], any> | undefined;
    
    if(Object.keys(context.req.cookies).length) {
        booksmarksResponse = await client.get<Recipe[]>('/api/recipes/bookmarks');
        recipesResponse = await client.get<Recipe[]>('/api/recipes?userId=currentUser');
    }
    
    return {
        props: {
            booksmarks: booksmarksResponse ? booksmarksResponse.data : [],
            recipes: recipesResponse ? recipesResponse.data : [],
        },
    };
};

export default UserPage;