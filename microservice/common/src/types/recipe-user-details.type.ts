import { UserEvent } from '../events/user-events/user-events.types';
import { BaseRecipe } from './base-recipe.type';

export interface RecipeUserDetails extends Omit<BaseRecipe, 'userId'> {
    userId: UserEvent,
    id: string
}