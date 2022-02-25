/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserUpdatedEvent, UserEvent, natsWrapper } from '@mickenhosrecipes/common';
import { UserUpdatedListener } from '../user-updated-listener';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/user.model';

describe('UserUpdatedListener',() => {

    //let user: UserDoc;
    let listener: UserUpdatedListener;
    let data: UserUpdatedEvent['data'];
    const userId = new mongoose.Types.ObjectId().toHexString();
    
    const updatedUser: UserEvent = {
        username: 'new Username',
        email: 'test@test.com',
        image: 'new-image',
    };

    const ackFun = jest.fn();
    // @ts-ignore
    const message: Message = {
        ack: ackFun,
    };


    beforeEach(async () => {

        jest.clearAllMocks();
        listener = new UserUpdatedListener(natsWrapper.client);
        data = {
            version: 1,
            userId,
            user: updatedUser,
        };

        const newUser: UserEvent = {
            username: 'username',
            email: 'test@test.com',
            image: 'path-to-image',
        };
        const nUser = UserModel.build(userId, newUser);
        await nUser.save();
    });


    it('acknowledge the message', async () => {

        await listener.onMessage(data,message);

        expect(ackFun).toHaveBeenCalledTimes(1);
    });

    it('creates a new user with correct entries', async () => {

        await listener.onMessage(data,message);
        
        const user = await UserModel.findById(userId);
        expect(user!.id).toBe(userId);
        expect(user!.version).toBe(1);
        for(const [key, value] of Object.entries(updatedUser)) {
            expect(user!.get(key)).toBe(value);
        }
    });
});