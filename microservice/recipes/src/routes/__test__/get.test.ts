import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { createRecipe } from './shared';
import { RECIPES } from './dummy-recipes';
import { RecipeModel } from '../../models/recipe.model';

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

        const recipe = RECIPES[0];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .get(`/api/recipes/${foundRecipe[0].id}`)
            .send()
            .expect(200);

        expect(response.body.name).toBe(recipe.name);
        expect(response.body.userId).toBeDefined();
        expect(response.body.description).toEqual(recipe.description);
        expect(response.body.categories).toEqual(recipe.categories);
        expect(response.body.ingredients).toEqual(recipe.ingredients);
        expect(response.body.duration).toEqual(recipe.duration);
    });
});