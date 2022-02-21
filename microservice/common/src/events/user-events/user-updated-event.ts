import { Subjects } from '../subjects';
import { UserEvent } from './user-events.types';

export interface UserUpdatedEvent {
    subject: Subjects.UserUpdated;
    data: {
        version: number;
        user: UserEvent;
    }
}