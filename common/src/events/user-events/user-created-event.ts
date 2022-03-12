import { Subjects } from '../subjects';
import { UserEventData } from './user-events.types';

export interface UserCreatedEvent {
    subject: Subjects.UserCreated;
    data: UserEventData
}