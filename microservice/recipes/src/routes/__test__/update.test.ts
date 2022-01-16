import { Category, Duration, Ingredient } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { RecipeModel } from '../../models/recipe.model';
import { RECIPES } from './dummy-recipes';
import { createRecipe } from './shared';


describe('Update recipe - PUT /api/recipes/:id', () => {

    it('has a route handler listening to PUT /api/recipes/:id', async () => {

        const id = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app).put(`/api/recipes/${id}`).send();

        expect(response.status).not.toEqual(404);
    });


    it('can only be accessed if the user is signed in', async () => {

        const id = new mongoose.Types.ObjectId().toHexString();

        await request(app).put(`/api/recipes/${id}`)
            .send({})
            .expect(401);
    });


    it('returns a status other than 401 if the user is signed in', async () => {
        
        const id = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
          .put(`/api/recipes/${id}`)
          .set('Cookie', global.signin())
          .send({});
      
        expect(response.status).not.toEqual(401);
    });


    it('Throws bad request if requested recipe is not found', async () => {

        const id = new mongoose.Types.ObjectId().toHexString();

        await request(app)
          .put(`/api/recipes/${id}`)
          .set('Cookie', global.signin())
          .send({})
          .expect(400);
    });


    it('Can update name of a recipe and returns updated recipe', async () => {

        const newName = 'test';
        const recipe = RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .put(`/api/recipes/${foundRecipe[0].id}`)
            .set('Cookie', global.signin())
            .send({ ...recipe, name: newName });
 
        expect(response.body.name).toBe(newName);
    });


    it('Can update description of a recipe returns updated recipe', async () => {

        const newDescription: string[] = ['test', 'test2', 'test3'];
        const recipe = RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .put(`/api/recipes/${foundRecipe[0].id}`)
            .set('Cookie', global.signin())
            .send({ ...recipe, description: newDescription });
 
        expect(response.body.description.length).toBe(newDescription.length);
        expect(response.body.description).toEqual(newDescription);

    });


    it('Can update categories of a recipe returns updated recipe', async () => {

        const newCategories: Category[] = ['arabic', 'quick'];
        const recipe = RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .put(`/api/recipes/${foundRecipe[0].id}`)
            .set('Cookie', global.signin())
            .send({ ...recipe, categories: newCategories });
 
        expect(response.body.categories.length).toBe(newCategories.length);
        expect(response.body.categories).toEqual(newCategories);
    });


    it('Can update ingredients of a recipe returns updated recipe', async () => {

        const newIngredients: Ingredient[] = [
            { name: 'tomato', amount: 4, unit: 'g' },
            { name: 'water', amount: 500, unit: 'ml' }];
        const recipe = RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .put(`/api/recipes/${foundRecipe[0].id}`)
            .set('Cookie', global.signin())
            .send({ ...recipe, ingredients: newIngredients });
 
        expect(response.body.ingredients.length).toBe(newIngredients.length);
        expect(response.body.ingredients).toEqual(newIngredients);
    });


    it('Can update duration of a recipe returns updated recipe', async () => {

        const newDuration: Duration = { duration: 5, unit: 'min' };
        const recipe = RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .put(`/api/recipes/${foundRecipe[0].id}`)
            .set('Cookie', global.signin())
            .send({ ...recipe, duration: newDuration });
 
        expect(response.body.duration).toEqual(newDuration);
    });


    it('Can NOT update duration of a recipe', async () => {

        const newUserId: string = new mongoose.Types.ObjectId().toHexString();
        const recipe = RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await request(app)
            .put(`/api/recipes/${foundRecipe[0].id}`)
            .set('Cookie', global.signin())
            .send({ ...recipe, userId: newUserId });
 
        expect(response.body.userId).not.toEqual(newUserId);

    });

});