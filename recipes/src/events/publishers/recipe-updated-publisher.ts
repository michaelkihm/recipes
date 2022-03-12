import { Publisher, Subjects, RecipeUpdatedEvent } from '@mickenhosrecipes/common';

export class RecipeUpdatedPublisher extends Publisher<RecipeUpdatedEvent> {

    readonly subject = Subjects.RecipeUpdated;
}