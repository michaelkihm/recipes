import request from 'supertest';
import { app } from '../../app';
import { NEW_RECIPES } from './dummy-new-recipes';
import { createRecipe } from './shared';


describe('Get recipes - /api/recipes', () => {

    it('has a route handler listening to GET /api/recipes', async () => {

        const response = await request(app).get('/api/recipes').send();
        expect(response.status).not.toEqual(404);
    });

    it('can fetch a list of recipes', async () => {

        await createRecipe(NEW_RECIPES[0]);
        await createRecipe(NEW_RECIPES[1]);
        await createRecipe(NEW_RECIPES[2]);

        const response = await request(app).get('/api/recipes').send().expect(200);

        expect(response.body.length).toEqual(3);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.body.forEach((recipe: any, i: number) => {
            expect(recipe.name).toBe(NEW_RECIPES[i].name);
            expect(recipe.description).toEqual(NEW_RECIPES[i].description);
            expect(recipe.categories).toEqual(NEW_RECIPES[i].categories);
            expect(recipe.ingredients).toEqual(NEW_RECIPES[i].ingredients);
            expect(recipe.duration).toEqual(NEW_RECIPES[i].duration);
            expect(recipe.id).toBeDefined();
            expect(recipe._id).not.toBeDefined();

        });
    });
});