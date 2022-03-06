import { Category, Duration, Ingredient } from '@mickenhosrecipes/common';
import { FormEvent, FunctionComponent, useState } from 'react';
import ImageInput from '../../components/ImageInput';
import CategoryInput from '../../components/RecipeForm/CategoryInput';
import DescriptionInput, { removeEmptyDescriptionSteps } from '../../components/RecipeForm/DescriptionInput';
import DurationInput from '../../components/RecipeForm/DurationInput';
import IngredientsInput, { removeEmptyIngredients } from '../../components/RecipeForm/IngredientsInput';
import NameInput from '../../components/RecipeForm/NameInput';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import FormData from 'form-data';
import Form from '../../components/Form';

const defaultImage = '/api/recipes/images/recipe-dummy.png';

const Add: FunctionComponent = () => {

    const [name, setName] = useState<string>('');
    const [duration, setDuration] = useState<Duration>({ unit: 'min', duration: 0 });
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { doRequest, errors } = useRequest({
        url: '/api/recipes',
        method: 'post', body: createRecipeFormData(name, description, categories, duration, ingredients, selectedImage),
        onSuccess: (recipe: any) => {
            console.log(recipe.name)
            Router.push(`${recipe.id}`)
        }
    })

    const onSubmit = async (event: FormEvent) => {

        event.preventDefault();
        doRequest();
    }
    

    return (
        <Form onSubmit={onSubmit} errors={errors} title="Rezept erstellen" className="h-full flex flex-col gap-y-2 overflow-y-scroll">
            <NameInput value={name} onChange={ setName }/>
            <DurationInput duration={ duration } setDuration={ setDuration }/>
            <ImageInput selectedImage={selectedImage} onChange={setSelectedImage} defaultImage={defaultImage}/>
            <CategoryInput categories={categories} setCategories={ setCategories } />
            <div className="w-full py-2 flex justify-center items-center bg-mandy text-white text-bold">
                <p>Zutaten</p>
            </div>
            <IngredientsInput ingredients={ingredients} setIngredients={setIngredients}/>
            <div className="w-full py-2 flex justify-center items-center bg-mandy text-white text-bold">
                <p>Zubereitung</p>
            </div>
            <DescriptionInput description={description} setDescription={setDescription} />
        </Form>
    );
};

const createRecipeFormData = (
    name: string, description: string[], categories: Category[], duration: Duration, ingredients: Ingredient[], image: File | null ) => {
    
        const recipeFormData = new FormData();

        recipeFormData.append('name', name);
        recipeFormData.append('categories', JSON.stringify(categories))
        recipeFormData.append('image', image || '');
        recipeFormData.append('duration', JSON.stringify(duration));
        recipeFormData.append('description', JSON.stringify(removeEmptyDescriptionSteps(description)));
        recipeFormData.append('ingredients', JSON.stringify(removeEmptyIngredients(ingredients)))

        return recipeFormData;
};

export default Add;