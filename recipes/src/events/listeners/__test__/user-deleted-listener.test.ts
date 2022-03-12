/* eslint-disable @typescript-eslint/ban-ts-comment */
import { natsWrapper, UserDeletedEvent, UserEvent } from '@mickenhosrecipes/common';
import { UserDeletedListener } from '../user-deleted-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { UserDoc, UserModel } from '../../../models/user.model';
import { RecipeModel } from '../../../models/recipe.model';
import { NEW_RECIPES } from '../../../routes/__test__/data/dummy-new-recipes';

describe('UserDeletedListener', () => {

    let user: UserDoc;
    let listener: UserDeletedListener;
    let data: UserDeletedEvent['data'];
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
        listener = new UserDeletedListener(natsWrapper.client);
        data = {
            version: 1,
            userId,
        };
        user = UserModel.build(userId, newUser);
        await user.save();
    });

    it('acknowledge the message', async () => {

        await listener.onMessage(data,message);

        expect(ackFun).toHaveBeenCalledTimes(1);
    });

    it('deletes all recipes from deleted user', async () => {

        const recipe1 = RecipeModel.build({ ...NEW_RECIPES[0], userId: user.id });
        await recipe1.save();
        const recipe2 = RecipeModel.build({ ...NEW_RECIPES[1], userId: user.id });
        await recipe2.save();


        await listener.onMessage(data,message);

        const userRecipes = await RecipeModel.find({ userId: user.id });
        expect(userRecipes.length).toBe(0);
    });
});