import { Publisher, Subjects, UserDeletedEvent } from '@mickenhosrecipes/common';

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {

    readonly subject = Subjects.UserDeleted;
}