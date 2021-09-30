import { Category } from './category.type';
import { Ingredient } from './ingredient.model';

export const ALL_DURATION_UNITS = ['min' , 'h'];
type Unit = typeof ALL_DURATION_UNITS[number];
interface Duration {
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
    duration: Duration
}