import { Subjects } from '../subjects';
import { Recipe } from '../../types/recipe.type';

export interface RecipeCreatedEvent {
    subject: Subjects.RecipeCreated;
    data: Recipe;
    version: number;
}