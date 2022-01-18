import { Category } from './category.type';
import { Duration } from './duration.type';
import { Ingredient } from './ingredient.type';

export interface NewRecipe {
    name: string,
    description: string[],
    ingredients: Ingredient[],
    userId: string,
    categories: Category[],
    duration: Duration,
    image?: string,
}