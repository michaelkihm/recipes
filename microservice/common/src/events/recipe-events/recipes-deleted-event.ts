import { Subjects } from '../subjects';
import { Recipe } from '../../types/recipe.type';

export interface RecipesDeletedEvent {
    subject: Subjects.RecipesDeleted;
    data: Recipe[]
}