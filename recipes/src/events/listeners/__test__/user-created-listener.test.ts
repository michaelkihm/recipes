/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserCreatedEvent, UserEvent, natsWrapper } from '@mickenhosrecipes/common';
import { UserCreatedListener } from '../user-created-listener';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/user.model';

describe('UserCreatedListener',() => {

    //let user: UserDoc;
    let listener: UserCreatedListener;
    let data: UserCreatedEvent['data'];
    const userId = new mongoose.Types.ObjectId().toHexString();
    const newUser: UserEvent = {
        username: 'username',
        email: 'test@test.com',
        image: 'path-to-image',
    };

    const ackFun = jest.fn();
    // @ts-ignore
    const message: Message = {
        ack: ackFun,
    };

    beforeEach(async () => {

        jest.clearAllMocks();
        listener = new UserCreatedListener(natsWrapper.client);
        data = {
            version: 1,
            userId,
            user: newUser,
        };
    });


    it('acknowledge the message', async () => {

        await listener.onMessage(data,message);

        expect(ackFun).toHaveBeenCalledTimes(1);
    });

    it('creates a new user with correct entries', async () => {

        await listener.onMessage(data,message);
        const user = await UserModel.findById(userId);
        
        expect(user!.id).toBe(userId);
        for(const [key, value] of Object.entries(newUser)) {
            expect(user!.get(key)).toBe(value);
        }
    });
});