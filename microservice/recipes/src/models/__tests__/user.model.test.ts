import { UserEventData, UserEvent } from '@mickenhosrecipes/common';
import { UserModel } from '../user.model';
import mongoose from 'mongoose';
import { NEW_RECIPES } from '../../routes/__test__/data/dummy-new-recipes';
import { RecipeModel } from '../recipe.model';

describe('User Model', () => {
    
    const newUser: UserEvent = {
        username: 'username',
        email: 'test@test.com',
        image: 'path-to-image',
    };

    it('creates a user coming from an user:created event', () => {

        const id = new mongoose.Types.ObjectId().toHexString();
        const userEventData: UserEventData = {
            user: newUser,
            version: 0,
            userId: id,
        };
        const user = UserModel.build(userEventData.userId, userEventData.user);

        for(const [key, value] of Object.entries(userEventData.user)){
            expect(user.get(key)).toBe(value);
        }
    });

    it('has an middleware which deletes all recipes from user before user is deleted', async () => {

        const id = new mongoose.Types.ObjectId().toHexString();
        const user = UserModel.build(id, newUser);
        await user.save();

        const recipe1 = RecipeModel.build({ ...NEW_RECIPES[0], userId: user.id });
        await recipe1.save();
        const recipe2 = RecipeModel.build({ ...NEW_RECIPES[1], userId: user.id });
        await recipe2.save();
        const recipe3 = RecipeModel.build({ ...NEW_RECIPES[3] });
        await recipe3.save();

        let userRecipes = await RecipeModel.find({ userId: id });
        expect(userRecipes.length).toBe(2);

        await user.remove();

        userRecipes = await RecipeModel.find({ userId: id });
        expect(userRecipes.length).toBe(0);
        userRecipes = await RecipeModel.find({});
        expect(userRecipes.length).toBe(1);
        
    });
});