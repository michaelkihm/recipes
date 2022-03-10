import { Recipe } from '@mickenhosrecipes/common';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Router from 'next/router';
import { Fragment, FunctionComponent, useContext, useReducer, useState } from 'react';
import imageLoader from '../../api/image-loader';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import RecipeListElement from '../../components/RecipeListElement';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import UserContext from '../../context/user-context';
import useRequest from '../../hooks/use-request';

interface UserPageProps {
    booksmarks: Recipe[];
    recipes: Recipe[];
}
const UserPage: FunctionComponent<UserPageProps> = ({ booksmarks, recipes }) => {

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const { currentUser } = useContext(UserContext);
    const deleteRequest = useRequest({
        url: '/api/users',
        method: 'delete',
        body: {},
        onSuccess: () => {
            setShowDeleteModal(false);
            Router.push('/');
        }
    })

    const deleteAccount = async () => deleteRequest.doRequest();
    

    if(!currentUser) return <p className="p-2 bg-danger">Kein Benutzer eingeloggt</p>;

    return (
        <Fragment>
            <div className='flex flex-col '>
                <div className="flex justify-between">
                    {currentUser.image &&
                        <div className='w-1/3 drop-shadow-lg'>
                            <Image
                                src={currentUser.image}
                                alt={currentUser.username}
                                width={200} height={200}
                                loader={imageLoader} unoptimized/>
                        </div>}
                    <div>
                        <Button color="danger" onClick={() => setShowDeleteModal(true)}>
                            Account löschen
                        </Button>
                        {deleteRequest.errors.length > 0 && <div className='mt-2 px-1 bg-danger'>
                            <h4 className='underline'>something went wrong</h4>
                            {deleteRequest.errors.map(err => <p key={err.message}>{err.message}</p>)}
                        </div>}
                    </div>
                </div>
                
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
            {showDeleteModal && <Modal onClose={() => setShowDeleteModal(false)} title="Account löschen">
                <div className="pt-2 px-1 pb-1 flex justify-end gap-x-1">
                    <Button color="black" onClick={deleteAccount}>Ok</Button>
                    <Button color="white" onClick={() => setShowDeleteModal(false)}>Abbrechen</Button>
                </div>
                </Modal>}
        </Fragment>
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