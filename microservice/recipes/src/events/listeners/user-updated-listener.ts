import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@mickenhosrecipes/common';
import { queueGroupName } from './queue-group-name';
import { UserModel } from '../../models/user.model';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {

    readonly subject = Subjects.UserUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: UserUpdatedEvent['data'], msg: Message): Promise<void> {

        const user = await UserModel.findByEvent({ id: data.userId, version: data.version });
        if(user) {
            await user.update(data.user);
            await user.save();
            msg.ack();
        }
        
    }
}