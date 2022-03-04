import { Category, Duration, Ingredient } from '@mickenhosrecipes/common';
import { FunctionComponent, useState } from 'react';
import ImageInput from '../../components/ImageInput';
import CategoryInput from '../../components/RecipeForm/CategoryInput';
import DescriptionInput from '../../components/RecipeForm/DescriptionInput';
import DurationInput from '../../components/RecipeForm/DurationInput';
import IngredientsInput from '../../components/RecipeForm/IngredientsInput';
import NameInput from '../../components/RecipeForm/NameInput';

const defaultImage = '/api/recipes/images/recipe-dummy.png';

const Add: FunctionComponent = () => {

    const [name, setName] = useState<string>('');
    const [duration, setDuration] = useState<Duration>({ unit: 'min', duration: 0 });
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    

    return (
        <form className="h-full flex flex-col gap-y-2 overflow-y-scroll">
            <h1 className="text-2xl text-bold font-mono">Rezept erstellen</h1>
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
            <input 
                className='p-1 bg-blue-400 text-white hover:bg-blue-200 rounded'
                type="submit" 
                value="Hinzufügen" 
                onClick={() => document.getElementById('selectedFile')!.click() }/>
        </form>
    );
};

export default Add;