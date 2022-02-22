/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UserStrings } from '@mickenhosrecipes/common';
import { UserModel, UserDoc } from '../user';

const newUser: UserStrings = {
    email: 'test@test.com',
    password: 'password',
    username: 'username'
};

describe('User Model', () => {

    it('implements optimistic concurrency control', async () => {

        // Create an instance of an user
        const recipe = UserModel.build(newUser);
        await recipe.save();

        // Fetch recipe twice
        const firstInstance = await UserModel.findById(recipe.id);
        const secondInstance = await UserModel.findById(recipe.id);

        // Make to separate changes to the recipe
        firstInstance!.set({ username: 'New Cook' });
        secondInstance!.set({ username: 'Second Cook' });

        // Save first fetched recipe
        await firstInstance!.save();

        // Save second fetched recipe and expect an error
        try {
            await secondInstance!.save();
        } catch {
            return;
        }
          
        throw new Error('Should have thrown an Version Error');
    });

    it('increments the version number of multiple saves', async () => {

        let foundUser: UserDoc | null = null;
        const recipe = UserModel.build(newUser);
        await recipe.save();

        foundUser = await UserModel.findById(recipe.id);
        expect(foundUser?.version).toBe(0);

        foundUser!.set({ username: 'New Name' });
        await foundUser!.save();

        foundUser = await UserModel.findById(recipe.id);
        expect(foundUser?.version).toBe(1);

        await foundUser!.save();
        expect(foundUser?.version).toBe(2);
    });
});