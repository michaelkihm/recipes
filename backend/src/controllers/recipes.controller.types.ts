import { Recipe } from '../../../models/recipe.model';

export type RecipesGetResponse = {
    message: string,
    recipes: Recipe[]
};


export type SingleRecipeResponse = {
    message: string,
    recipe?: Recipe
};

export type DeleteRecipeResponse = {
    message: string;
};