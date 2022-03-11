import { Category, Duration, Ingredient } from '@mickenhosrecipes/common';
import FormData from 'form-data';
import { removeEmptyDescriptionSteps } from './DescriptionInput';
import { removeEmptyIngredients } from './IngredientsInput';

export const createRecipeFormData = (
    name: string, description: string[],
    categories: Category[], duration: Duration,
    ingredients: Ingredient[], image: File | null ): FormData => {
    
        const recipeFormData = new FormData();

        recipeFormData.append('name', name);
        recipeFormData.append('categories', JSON.stringify(categories));
        recipeFormData.append('image', image || '');
        recipeFormData.append('duration', JSON.stringify(duration));
        recipeFormData.append('description', JSON.stringify(removeEmptyDescriptionSteps(description)));
        recipeFormData.append('ingredients', JSON.stringify(removeEmptyIngredients(ingredients)));

        return recipeFormData;
};