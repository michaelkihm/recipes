import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { createRecipe } from './shared/create-recipe';
import { NEW_RECIPES } from './data/dummy-new-recipes';
import { RecipeModel } from '../../models/recipe.model';
import { UserModel } from '../../models/user.model';

describe('Get recipe - /api/recipes/:id', () => {

    it('has a route handler listening to GET /api/recipes/:id', async () => {

        const id = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app).get(`/api/recipes/${id}`).send();

        expect(response.status).not.toEqual(404);
    });


    it('returns a meaningful response message if recipe is not found', async () => {

        const id = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app).get(`/api/recipes/${id}`).send();

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toEqual(`Could not find recipe with id ${id}`);
    });

    
    it('returns a recipe if available in the db', async () => {

        const recipe = NEW_RECIPES[0];
        const user = UserModel.build(recipe.userId, { username: 'username', email: 'mail', image: 'image' });
        await user.save();

        const dbRecipe = RecipeModel.build(recipe);
        await dbRecipe.save();

        const response = await request(app)
            .get(`/api/recipes/${dbRecipe.id}`)
            .send()
            .expect(200);


        expect(response.body.name).toBe(recipe.name);
        expect(response.body.userId.username).toBe('username');
        expect(response.body.userId.email).toBe('mail');
        expect(response.body.userId.image).toBe('image');
        expect(response.body.id).toBeTruthy();
        expect(response.body.description).toEqual(recipe.description);
        expect(response.body.categories).toEqual(recipe.categories);
        expect(response.body.ingredients).toEqual(recipe.ingredients);
        expect(response.body.duration).toEqual(recipe.duration);
    });
});