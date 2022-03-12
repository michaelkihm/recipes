import { Category, Duration, Ingredient, RecipeUserDetails } from '@mickenhosrecipes/common';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { FormEvent, FunctionComponent, useContext, useState } from 'react';
import { buildAxiosBackendClient } from '../../../api/server-side-axios-client';
import Form from '../../../components/Form';
import ImageInput from '../../../components/ImageInput';
import PleaseLogin from '../../../components/PleaseLogin';
import CategoryInput from '../../../components/RecipeForm/CategoryInput';
import { createRecipeFormData } from '../../../components/RecipeForm/create-recipe-form-data';
import DescriptionInput from '../../../components/RecipeForm/DescriptionInput';
import DurationInput from '../../../components/RecipeForm/DurationInput';
import IngredientsInput from '../../../components/RecipeForm/IngredientsInput';
import NameInput from '../../../components/RecipeForm/NameInput';
import RecipeThematicBreak from '../../../components/RecipeThematicBreak';
import UserContext from '../../../context/user-context';
import useRequest from '../../../hooks/use-request';

interface EditRecipeProps {
    recipe: RecipeUserDetails;
}

const EditRecipe: FunctionComponent<EditRecipeProps> = ({ recipe }) => {

    const [name, setName] = useState<string>(recipe.name);
    const [duration, setDuration] = useState<Duration>(recipe.duration);
    const [categories, setCategories] = useState<Category[]>(recipe.categories);
    const [description, setDescription] = useState<string[]>(recipe.description);
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { currentUser } = useContext(UserContext);
    const { errors, doRequest } = useRequest({
        url: `/api/recipes/${recipe.id}`,
        method: 'put',
        body: createRecipeFormData(name, description, categories, duration, ingredients, selectedImage),
        onSuccess: () => Router.push(`/recipe/${recipe.id}`)
    });

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        doRequest();
    };

    if(!currentUser) return <PleaseLogin />;
    
    return (
        <Form onSubmit={ onSubmit } errors={ errors } title="Rezept bearbeiten"
            className="h-full flex flex-col gap-y-2 overflow-y-scroll">
            <NameInput value={ name } onChange={ setName } />
            <DurationInput duration={ duration } setDuration={ setDuration } />
            <ImageInput selectedImage={ selectedImage } onChange={ setSelectedImage } defaultImage={ recipe.image! }
                className="w-8/12 drop-shadow-lg" />
            <CategoryInput categories={ categories } setCategories={ setCategories } />
            <RecipeThematicBreak name="Zutaten" />
            <IngredientsInput ingredients={ ingredients } setIngredients={ setIngredients } />
            <RecipeThematicBreak name="Zubereitung" />
            <DescriptionInput description={ description } setDescription={ setDescription } />
        </Form>
    );
};

export const getServerSideProps: GetServerSideProps<EditRecipeProps> = async (context) => {

    const client = buildAxiosBackendClient(context.req.headers);

    const { data } = await client.get<RecipeUserDetails>(`api/recipes/${context.query.id}`);

    return {
        props: {
          recipe: data,
        },
    };

};

export default EditRecipe;