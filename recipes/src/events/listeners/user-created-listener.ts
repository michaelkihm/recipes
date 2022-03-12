import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCreatedEvent } from '@mickenhosrecipes/common';
import { queueGroupName } from './queue-group-name';
import { UserModel } from '../../models/user.model';

export class UserCreatedListener extends Listener<UserCreatedEvent> {

    readonly subject = Subjects.UserCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: UserCreatedEvent['data'], msg: Message): Promise<void> {

        const user = UserModel.build(data.userId, data.user);
        await user.save();
        msg.ack();
    }
}