import { Category } from './category.type';
import { Ingredient } from './ingredient.model';

export const ALL_DURATION_UNITS = ['min' , 'h'];
type Unit = typeof ALL_DURATION_UNITS[number];
export interface Duration {
    duration: number,
    unit: Unit
}

export interface Recipe {
    name: string,
    description: string[],
    id?: string,
    ingredients: Ingredient[],
    createdBy: string,
    categories: Category[],
    duration: Duration,
    image?: string,
}

type HasKeys<T> = {
    [P in keyof T]: string
};

export type RecipeStrings = HasKeys<Recipe>;

export const recipeFormDataToRecipe = (formData: RecipeStrings): Recipe => {
    
    const hasImageChanged = () => typeof formData.image !== 'string';

    const description = JSON.parse(formData.description) as string[];
    const ingredients = JSON.parse(formData.ingredients) as Ingredient[];
    const categories = JSON.parse(formData.categories) as Category[];
    const duration = JSON.parse(formData.duration) as Duration;
    const image = hasImageChanged() ? '' : formData.image;

    return {
        id: formData.id,
        name: formData.name,
        description,
        ingredients,
        createdBy: formData.createdBy,
        categories,
        duration,
        image
    };
};