import { NewRecipe } from './new-recipe.type';

export interface Recipe extends NewRecipe {
    userId: string,
    id: string
}