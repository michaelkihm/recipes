import { Category } from './category.type';
import { Ingredient } from './ingredient.model';


export class Recipe {
    constructor(
        public name: string,
        public description: string,
        public id: string,
        public ingredients: Ingredient[],
        public createdBy: string,
        public category: Category
    ) {}
}