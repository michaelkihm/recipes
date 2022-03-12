import { Recipe, RecipeUserDetails } from '@mickenhosrecipes/common';
import { AxiosResponse } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { buildAxiosBackendClient } from '../../api/server-side-axios-client';
import { updateBookmarksRequest } from '../../api/update-bookmarks';
import Button from '../../components/Button';
import ErrorDialog from '../../components/ErrorDialog';
import BookmarkIcon from '../../components/icons/BookmarkIcon';
import BulletPointIcon from '../../components/icons/BulletPointIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import EditIcon from '../../components/icons/EditIcon';
import Modal from '../../components/Modal';
import RecipeImage from '../../components/RecipeImage';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import UserContext from '../../context/user-context';
import useRequest from '../../hooks/use-request';

interface RecipePageProps {
    recipe: RecipeUserDetails;
    bookmarks: string[];
}

const ICON_SIZE_REM = 2;

const RecipePage: NextPage<RecipePageProps> = ({ recipe, bookmarks }) => {

    const { name, image, duration, categories, ingredients, description, userId, id } = recipe;
    const [bookmarked, setBookmarked] = useState<boolean>(bookmarks.includes(id));
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const { currentUser } = useContext(UserContext);
    const { doRequest, errors } = useRequest({
        url: `/api/recipes/${id}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push('/')
    });

    const isAuthor = () => currentUser?.email === userId.email;

    const deleteRecipeHandler = () => {
        setShowDeleteModal(false);
        doRequest();
    };

    const editRecipeHandler = () => Router.push(`/recipe/edit/${id}`);

    useEffect(() => {
        currentUser && updateBookmarksRequest(bookmarked ? 'push' : 'pull', id);
    },[bookmarked, currentUser, id]);

    return (
        <Fragment>
            <div className="h-full flex flex-col gap-y-2 overflow-y-auto scroll-container">
                <div className="w-full mb-2 flex justify-between">
                    <div className="grow relative flex gap-x-2">
                        <h1 className="text-3xl font-mono">{name}</h1>
                        <p className="absolute top-7 text-gray-400 font-bold">by {userId.username}</p>
                        {currentUser && <BookmarkIcon
                            checked={ bookmarked }
                            sizeRem={ ICON_SIZE_REM } onClick={ () => setBookmarked(!bookmarked) } />}
                    </div>
                    <div className="flex gap-x-1">
                        {isAuthor() && <EditIcon
                            sizeRem={ ICON_SIZE_REM } onClick={ editRecipeHandler }
                            className="border border-black box-shadow-lg rounded bg-white" />}
                        {isAuthor() && <CloseIcon
                            sizeRem={ ICON_SIZE_REM } className="bg-danger rounded"
                            onClick={ () => setShowDeleteModal(true) } />}
                    </div>
                </div>
                {errors.length > 0 && <ErrorDialog errors={ errors } />}
                <div className="flex gap-x-1">
                    <p className="font-bold">Zeit:</p>
                    <p>{duration.duration}</p>
                    <p>{duration.unit}</p>
                </div>
                { image && <RecipeImage
                    imagePath={ image } name={ name } categories={ categories } className="h-full" />}
                <div className="flex flex-wrap gap-x-1">
                    { categories.map(category => (
                        <div key={ category }
                            className="min-w-[25%] px-1 py-0.5 flex justify-center items-center rounded-lg bg-chenin">
                                <p className="text-black">{category}</p>
                        </div>
                    ))}
                </div>
                <RecipeThematicBreak name="Zutaten" />
                <ul className="list-inside">
                    {ingredients.map(ingredient => (
                        <li key={ `${ingredient.name}:${ingredient.amount}` } className="flex items-center gap-x-1">
                            <BulletPointIcon />
                            <p>{ingredient.amount}</p>
                            <p>{ingredient.unit}</p>
                            <p>{ingredient.name}</p>
                        </li>
                    ))}
                </ul>
                <RecipeThematicBreak name="Zubereitung" />
                {description.map((step,i) => (
                    <div key={ i }>
                        <p className="font-bold">Schritt {i + 1}</p>
                        <p>{step}</p>
                    </div>
                ))}
            </div>
            {showDeleteModal && <Modal onClose={ () => setShowDeleteModal(false) } title="Rezept löschen">
                <div className="p-1 flex flex-col gap-y-2 overflow-x-hidden">
                    <p>Möchtest du das Rezept {name} löschen?</p>
                    <div className="pt-2 px-1 pb-1 flex justify-end gap-x-1">
                        <Button color="black" onClick={ deleteRecipeHandler }>OK</Button>
                        <Button color="white" onClick={ () => setShowDeleteModal(false) }>Abbrechen</Button>
                    </div>
                </div>
                </Modal>}
        </Fragment>
    );
};


export const getServerSideProps: GetServerSideProps<RecipePageProps> = async (context) => {
    
    const client = buildAxiosBackendClient(context.req.headers);
    let booksmarksResponse: AxiosResponse<Recipe[], unknown> | undefined;

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