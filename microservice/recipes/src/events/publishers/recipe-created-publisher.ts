import { Publisher, Subjects, RecipeCreatedEvent } from '@mickenhosrecipes/common';

export class RecipeCreatedPublisher extends Publisher<RecipeCreatedEvent> {

    readonly subject = Subjects.RecipeCreated;
}