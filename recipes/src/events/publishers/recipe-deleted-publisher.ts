import { Publisher, Subjects, RecipesDeletedEvent } from '@mickenhosrecipes/common';

export class RecipeDeletedPublisher extends Publisher<RecipesDeletedEvent> {

    readonly subject = Subjects.RecipesDeleted;
}