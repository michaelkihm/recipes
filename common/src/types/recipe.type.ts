import { BaseRecipe } from './base-recipe.type';
import { HasKeys } from './shared.types';

export interface Recipe extends BaseRecipe {
    userId: string,
    id: string
}

export type RecipeStrings = HasKeys<Recipe>;