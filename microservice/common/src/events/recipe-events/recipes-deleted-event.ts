import { Subjects } from '../subjects';

export interface RecipesDeletedEvent {
    subject: Subjects.RecipesDeleted;
    data: string[]
}