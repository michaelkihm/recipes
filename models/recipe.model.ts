import { Category } from './category.type';
import { Ingredient } from './ingredient.model';

interface Duration {
    duration: number,
    unit: 'min' | 'h'
}

export interface Recipe {
    name: string,
    description: string[],
    id?: string,
    ingredients: Ingredient[],
    createdBy: string,
    category: Category[],
    duration: Duration
}