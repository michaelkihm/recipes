import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserDeletedEvent } from '@mickenhosrecipes/common';
import { queueGroupName } from './queue-group-name';
import { UserModel } from '../../models/user.model';

export class UserDeletedListener extends Listener<UserDeletedEvent> {

    readonly subject = Subjects.UserDeleted;
    queueGroupName = queueGroupName;

    async onMessage(data: UserDeletedEvent['data'], msg: Message): Promise<void> {

        const user = await UserModel.findById(data.userId);
        if(user) {
            await user.remove();
            msg.ack();
        }
    }
}