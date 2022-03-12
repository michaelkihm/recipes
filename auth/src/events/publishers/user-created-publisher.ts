import { Publisher, Subjects, UserCreatedEvent } from '@mickenhosrecipes/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {

    readonly subject = Subjects.UserCreated;
}