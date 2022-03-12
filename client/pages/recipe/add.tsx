import { Category, Duration, Ingredient } from '@mickenhosrecipes/common';
import Router from 'next/router';
import { FormEvent, FunctionComponent, useContext, useState } from 'react';
import Form from '../../components/Form';
import ImageInput from '../../components/ImageInput';
import PleaseLogin from '../../components/PleaseLogin';
import CategoryInput from '../../components/RecipeForm/CategoryInput';
import { createRecipeFormData } from '../../components/RecipeForm/create-recipe-form-data';
import DescriptionInput from '../../components/RecipeForm/DescriptionInput';
import DurationInput from '../../components/RecipeForm/DurationInput';
import IngredientsInput from '../../components/RecipeForm/IngredientsInput';
import NameInput from '../../components/RecipeForm/NameInput';
import RecipeThematicBreak from '../../components/RecipeThematicBreak';
import UserContext from '../../context/user-context';
import useRequest from '../../hooks/use-request';

const defaultImage = '/api/recipes/images/recipe-dummy.png';

const Add: FunctionComponent = () => {

    const [name, setName] = useState<string>('');
    const [duration, setDuration] = useState<Duration>({ unit: 'min', duration: 0 });
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { currentUser } = useContext(UserContext);
    const { doRequest, errors } = useRequest({
        url: '/api/recipes',
        method: 'post', body: createRecipeFormData(name, description, categories, duration, ingredients, selectedImage),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (recipe: any) => Router.push(`${recipe.id}`),
    });

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        doRequest();
    };

    if(!currentUser) return <PleaseLogin />;
    
    return (
        <Form onSubmit={ onSubmit } errors={ errors } title="Rezept erstellen"
            className="h-full flex flex-col gap-y-2 overflow-y-scroll">
                <NameInput value={ name } onChange={ setName } />
                <DurationInput duration={ duration } setDuration={ setDuration } />
                <ImageInput selectedImage={ selectedImage } onChange={ setSelectedImage } defaultImage={ defaultImage }
                    className="w-8/12 drop-shadow-lg" />
                <CategoryInput categories={ categories } setCategories={ setCategories } />
                <RecipeThematicBreak name="Zutaten" />
                <IngredientsInput ingredients={ ingredients } setIngredients={ setIngredients } />
                <RecipeThematicBreak name="Zubereitung" />
                <DescriptionInput description={ description } setDescription={ setDescription } />
        </Form>
    );
};

export default Add;