import { app } from '../../app';
import request from 'supertest';
import { UserModel, UserDoc } from '../../models/user.model';
import { NEW_RECIPES, user1Id } from './data/dummy-new-recipes';
import mongoose from 'mongoose';
import { RecipeModel } from '../../models/recipe.model';
import { BaseRecipe } from '@mickenhosrecipes/common';

describe('PATCH bookmarks - /api/recipes/bookmarks', () => {

    let user: UserDoc;

    beforeEach( async () => {
        user = UserModel.build(user1Id, { username: 'username', email: 'test@test.com', image: 'image' });
        await user.save();
        // NEW_RECIPES.forEach(async (recipe) => {
        //     const rec = RecipeModel.build(recipe)
        //     await rec.save()
        // });
        // await RecipeModel.build(NEW_RECIPES[0]).save();
        // await RecipeModel.build(NEW_RECIPES[1]).save();
    });

    it('has a route handler listening to PATCH /api/recipes/bookmarks', async () => {

        const response = await request(app).patch('/api/recipes/bookmarks').send();

        expect(response.status).not.toEqual(404);
    });

    it('can only be accessed if the user is signed in', async () => {

        await request(app).patch('/api/recipes/bookmarks')
            .send({})
            .expect(401);
    });

    it('returns an error if recipeId in request body is not valid', async () => {
        //method: 'push' | 'pull', recipeId: string
        const response = await request(app).patch('/api/recipes/bookmarks')
            .set('Cookie', global.signin())
            .send({
                method: 'push',
                recipeId: '123',
            })
            .expect(400);
        
        expect(response.body.errors[0].message).toBe('Please provide valid MongoDB recipeId');
    });

    it('returns an error if mthod in request body is different than push or pull', async () => {
 
        const response = await request(app).patch('/api/recipes/bookmarks')
            .set('Cookie', global.signin())
            .send({
                method: 'adfadf',
                recipeId: new mongoose.Types.ObjectId().toHexString(),
            })
            .expect(400);
        
        expect(response.body.errors[0].message).toBe('body.method can only have values push or pull');
    });

    it('adds an bookmark when body.method is equal to push', async () => {

        const rec0 = RecipeModel.build(NEW_RECIPES[0]);
        await rec0.save();
        await RecipeModel.build(NEW_RECIPES[1]).save();

        const response = await request(app).patch('/api/recipes/bookmarks')
            .set('Cookie', global.signin())
            .send({
                method: 'push',
                recipeId: rec0.id
            });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe(rec0.name);
        expect(response.body[0].id).toBe(rec0.id);
    });

    it('deletes an bookmark when body.method is equal to pull', async () => {
        
        for(const recipe of NEW_RECIPES){
            const rec = RecipeModel.build(recipe);
            user.bookmarks.push(rec.id);
            await rec.save();
        }
        await user.save();
        const recipe0 = await RecipeModel.find({ name: NEW_RECIPES[1].name });

        const response = await request(app).patch('/api/recipes/bookmarks')
            .set('Cookie', global.signin())
            .send({
                method: 'pull',
                recipeId: recipe0[0].id
            });

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(NEW_RECIPES.length - 1);
        expect(response.body.find((recipe: BaseRecipe) => recipe.name === recipe0[0].name)).toBeFalsy();
    });
});