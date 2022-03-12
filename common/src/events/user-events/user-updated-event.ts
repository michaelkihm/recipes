import { Subjects } from '../subjects';
import { UserEventData } from './user-events.types';

export interface UserUpdatedEvent {
    subject: Subjects.UserUpdated;
    data: UserEventData;
}