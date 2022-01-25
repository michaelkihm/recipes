import { BaseRecipe } from './base-recipe.type';

export interface Recipe extends BaseRecipe {
    userId: string,
    id: string
}