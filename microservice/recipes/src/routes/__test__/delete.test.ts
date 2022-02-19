import { natsWrapper } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';
import { RecipeDoc, RecipeModel } from '../../models/recipe.model';
import { NEW_RECIPES } from './data/dummy-new-recipes';
import { createRecipe } from './shared/create-recipe';


describe('Delete recipes - /api/recipes/:id', () => {

    beforeEach(() => jest.clearAllMocks());


    it('has a route handler listening to DELETE /api/recipes/:id', async () => {

        const response = await request(app).delete('/api/recipes/1234').send({});
        expect(response.status).not.toEqual(404);
    });


    it('can only be accessed if the user is signed in', async () => {

        await request(app).delete('/api/recipes/1234')
            .send({})
            .expect(401);
    });


    it('returns a status other than 401 if the user is signed in', async () => {
        const response = await request(app)
          .delete('/api/recipes/1234')
          .set('Cookie', global.signin())
          .send({});
      
        expect(response.status).not.toEqual(401);
    });


    it('deletes a recipe if the user is signed in and provides a valid id in the url', async () => {
        
        const recipe = NEW_RECIPES[0];
        let recipes: RecipeDoc[];
        await createRecipe(recipe);

        recipes = await RecipeModel.find({ name: recipe.name });
        expect(recipes.length).toBe(1);
        //console.log(response);

        await request(app)
          .delete(`/api/recipes/${recipes[0]._id}`)
          .set('Cookie', global.signin())
          .send({})
          .expect(200);

        recipes = await RecipeModel.find({ name: recipe.name });
        expect(recipes.length).toBe(0);


    });

    
    it('publishes an event if recipe gets deleted', async () => {
        
        const newRecipe = NEW_RECIPES[0];
        const dbRecipe = RecipeModel.build(newRecipe);
        await dbRecipe.save();
        const foundRecipes = await RecipeModel.find({ name: newRecipe.name });

        await request(app)
          .delete(`/api/recipes/${foundRecipes[0]._id}`)
          .set('Cookie', global.signin())
          .send({})
          .expect(200);

        expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
    });

});