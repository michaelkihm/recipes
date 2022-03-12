import { UserEvent } from '../events/user-events/user-events.types';
import { BaseRecipe } from './base-recipe.type';

export interface RecipeUserDetails extends Omit<BaseRecipe, 'userId'> {
    userId: UserEvent,
    id: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRecipeUserDetails = (obj: RecipeUserDetails['userId'] | any) : obj is RecipeUserDetails['userId'] => {
    return (obj && obj.username && typeof obj.username === 'string' &&
        obj.email && typeof obj.email === 'string' &&
        obj.image && typeof obj.image === 'string');
};