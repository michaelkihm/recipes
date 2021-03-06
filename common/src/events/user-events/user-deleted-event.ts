import { Subjects } from '../subjects';

export interface UserDeletedEvent {
    subject: Subjects.UserDeleted;
    data: {
        version: number
        userId: string
    }
}