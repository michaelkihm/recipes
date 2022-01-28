import { BaseRecipe, Category, Duration, Ingredient } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { RecipeModel } from '../../models/recipe.model';
import { NEW_RECIPES } from './data/dummy-new-recipes';
import { createRecipe } from './shared/create-recipe';

const putRecipe = (recipe: BaseRecipe, id: string) => {
  
    return request(app)
            .put(`/api/recipes/${id}`)
            .attach('image',recipe.image || '')
            .set('Cookie', global.signin())
            .set('Content-type', 'multipart/form-data')
            .field('name',recipe.name )
            .field('userId', recipe.userId)
            .field('description', recipe.description ? JSON.stringify(recipe.description) : '')
            .field('categories', recipe.categories ? JSON.stringify(recipe.categories) : '')
            .field('duration',recipe.duration ? JSON.stringify(recipe.duration) : '')
            .field('ingredients',recipe.ingredients ? JSON.stringify(recipe.ingredients) : '');
};

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
        const recipe = NEW_RECIPES[1];
        await createRecipe({ ...recipe, image: undefined });
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe({ ...recipe, image: undefined, name: newName }, foundRecipe[0].id);

        expect(response.body.name).toBe(newName);
        expect(response.statusCode).toBe(200);
    });


    it('Can update description of a recipe returns updated recipe', async () => {

        const newDescription: string[] = ['test', 'test2', 'test3'];
        const recipe = NEW_RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe({ ...recipe, description: newDescription }, foundRecipe[0].id);
 
        expect(response.body.description.length).toBe(newDescription.length);
        expect(response.body.description).toEqual(newDescription);

    });


    it('Can update categories of a recipe returns updated recipe', async () => {

        const newCategories: Category[] = ['arabic', 'quick'];
        const recipe = NEW_RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe({ ...recipe, categories: newCategories }, foundRecipe[0].id);
 
        expect(response.body.categories.length).toBe(newCategories.length);
        expect(response.body.categories).toEqual(newCategories);
    });


    it('Can update ingredients of a recipe returns updated recipe', async () => {

        const newIngredients: Ingredient[] = [
            { name: 'tomato', amount: 4, unit: 'g' },
            { name: 'water', amount: 500, unit: 'ml' }];
        const recipe = NEW_RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe({ ...recipe, ingredients: newIngredients }, foundRecipe[0].id);
 
        expect(response.body.ingredients.length).toBe(newIngredients.length);
        expect(response.body.ingredients).toEqual(newIngredients);
    });


    it('Can update duration of a recipe returns updated recipe', async () => {

        const newDuration: Duration = { duration: 5, unit: 'min' };
        const recipe = NEW_RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe({ ...recipe, duration: newDuration }, foundRecipe[0].id);
 
        expect(response.body.duration).toEqual(newDuration);
    });


    it('Can NOT update userId of a recipe', async () => {

        const newUserId: string = new mongoose.Types.ObjectId().toHexString();
        const recipe = NEW_RECIPES[1];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe({ ...recipe, userId: newUserId }, foundRecipe[0].id);
 
        expect(response.body.userId).not.toEqual(newUserId);

    });


    it('Can update the image of a recipe', async () => {

        const recipe = NEW_RECIPES[2];
        await createRecipe(recipe);
        const foundRecipe = await RecipeModel.find({ name: recipe.name });

        const response = await putRecipe(recipe, foundRecipe[0].id);

        expect(response.body.image).not.toEqual(recipe.image);
        expect(response.body.image.includes(recipe.image)).toBeTruthy();
    });
});