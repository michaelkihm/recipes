import { Subjects } from '../subjects';
import { Recipe } from '../../types/recipe.type';

export interface RecipeUpdatedEvent {
    subject: Subjects.RecipeUpdated;
    data: Recipe
}