import { Recipe, UserDoc } from '@mickenhosrecipes/common';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import Button from '../../components/Button';
import ErrorDialog from '../../components/ErrorDialog';
import ImageInput from '../../components/ImageInput';
import Modal from '../../components/Modal';
import NameInput from '../../components/RecipeForm/NameInput';
import RecipeListElement from '../../components/RecipeListElement';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import useRequest from '../../hooks/use-request';
import FormData from 'form-data';

interface UserPageProps {
    booksmarks: Recipe[];
    recipes: Recipe[];
    user: UserDoc | null;
}

const UserPage: FunctionComponent<UserPageProps> = ({ booksmarks, recipes, user }) => {

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showNameModal, setShowNameModal] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(user?.username || '');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const deleteRequest = useRequest({
        url: '/api/users',
        method: 'delete',
        body: {},
        onSuccess: () => {
            setShowDeleteModal(false);
            Router.push('/');
        }
    })

    const updateRequest = useRequest({
        url: '/api/users',
        method: 'put',
        body: createUserFormData(username, selectedImage),
        onSuccess: () => {
            Router.push('/user');
        }
    })

    const usernameOkHandler = () => {
        setShowNameModal(false);
        updateUser();
    }

    const deleteAccount = async () => deleteRequest.doRequest();
    const updateUser = async () => updateRequest.doRequest();

    useEffect(() => { updateUser() },[selectedImage])
    
    if(!user) return <p className="p-2 bg-danger">Kein Benutzer eingeloggt</p>;

    return (
        <Fragment>
            <div className='flex flex-col '>
                <div className="flex justify-between">
                    {user.image &&
                        <div className="w-8/12">
                            <ImageInput
                                onChange={setSelectedImage}
                                selectedImage={selectedImage} defaultImage={user.image}
                                className="w-6/12 drop-shadow-lg"/>
                        </div>
                    }
                    <Button color="danger" onClick={() => setShowDeleteModal(true)} className="h-12">
                        Account löschen
                    </Button>  
                </div>
                <div className="w-8/12 pr-4 py-1 flex items-center justify-between">
                    <p>{username}</p>
                    <Button color="blue" onClick={() => setShowNameModal(true)}>Ändern</Button>
                </div>
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
      
                { deleteRequest.errors.length > 0 && <ErrorDialog errors={deleteRequest.errors} />}
                { updateRequest.errors.length > 0 && <ErrorDialog errors={updateRequest.errors}/>}
            </div>
            {showDeleteModal && <Modal onClose={() => setShowDeleteModal(false)} title="Account löschen">
                <div className="pt-2 px-1 pb-1 flex justify-end gap-x-1">
                    <Button color="black" onClick={deleteAccount}>Ok</Button>
                    <Button color="white" onClick={() => setShowDeleteModal(false)}>Abbrechen</Button>
                </div>
                </Modal>}
            { showNameModal && <Modal onClose={() => setShowNameModal(false)} title="Username ändern">
                    <div className="p-2 flex flex-col gap-y-2 overflow-x-hidden">
                        <NameInput value={username} onChange={setUsername}/>
                        <Button color="black" className="w-2/12 self-end" onClick={usernameOkHandler}>Ok</Button>
                    </div>
                </Modal>}
        </Fragment>
    );
};

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {

    const client = buildAxiosBackendClient(context.req.headers);
    let booksmarksResponse: AxiosResponse<Recipe[], any> | undefined;
    let recipesResponse: AxiosResponse<Recipe[], any> | undefined;
    let userResponse: AxiosResponse<{currentUser: UserDoc | null}, any> | null = null;
    
    if(Object.keys(context.req.cookies).length) {
        booksmarksResponse = await client.get<Recipe[]>('/api/recipes/bookmarks');
        recipesResponse = await client.get<Recipe[]>('/api/recipes?userId=currentUser');
        userResponse = await client.get<{currentUser: UserDoc | null}>('api/users/currentuser')
    }
    
    return {
        props: {
            booksmarks: booksmarksResponse ? booksmarksResponse.data : [],
            recipes: recipesResponse ? recipesResponse.data : [],
            user: userResponse ? userResponse.data.currentUser : null
        },
    };
};


const createUserFormData = (username: string, image: File | null ) => {
    
    const recipeFormData = new FormData();

    recipeFormData.append('username', username);
    recipeFormData.append('image', image || '');

    return recipeFormData;
};

export default UserPage;