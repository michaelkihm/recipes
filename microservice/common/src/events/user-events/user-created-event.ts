import { Subjects } from '../subjects';
import { UserEvent } from './user-events.types';

export interface UserCreatedEvent {
    subject: Subjects.UserCreated;
    data: {
        version: number;
        user: UserEvent;
    }
}