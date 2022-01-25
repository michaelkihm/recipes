import { Ingredient, Recipe, Category, Duration, BaseRecipe } from '@mickenhosrecipes/common';

export type HasKeys<T> = {
    [P in keyof T]: string
};

export type RecipeStrings = HasKeys<Recipe>;

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