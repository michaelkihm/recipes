import { Category } from './category.type';
import { Ingredient } from './ingredient.model';

interface Duration {
    duration: number,
    unit: 'min' | 'h'
}
export class Recipe {
    constructor(
        public name: string,
        public description: string,
        public id: string,
        public ingredients: Ingredient[],
        public createdBy: string,
        public category: Category[],
        public duration: Duration
    ) {}
}