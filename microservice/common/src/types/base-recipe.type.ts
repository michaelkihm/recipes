import { Category } from './category.type';
import { Duration } from './duration.type';
import { Ingredient } from './ingredient.type';
import { HasKeys } from './shared.types';

export interface BaseRecipe {
    name: string,
    description: string[],
    ingredients: Ingredient[],
    userId: string,
    categories: Category[],
    duration: Duration,
    image?: string,
}

export type BaseRecipeStrings = HasKeys<BaseRecipe>;

export const newRecipeStringToNewRecipe = (recipeString: BaseRecipeStrings): BaseRecipe => {
    
    const hasImageChanged = () => typeof recipeString.image !== 'string';

    const description = JSON.parse(recipeString.description) as string[];
    const ingredients = JSON.parse(recipeString.ingredients) as Ingredient[];
    const categories = JSON.parse(recipeString.categories) as Category[];
    const duration = JSON.parse(recipeString.duration) as Duration;
    const image = hasImageChanged() ? '' : recipeString.image;

    return {
        name: recipeString.name,
        description,
        ingredients,
        userId: recipeString.userId,
        categories,
        duration,
        image
    };
};