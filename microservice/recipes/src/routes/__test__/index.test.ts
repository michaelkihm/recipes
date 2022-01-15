import request from 'supertest';
import { app } from '../../app';
import { RECIPES } from './dummy-recipes';
import { createRecipe } from './shared';


describe('Get recipes - /api/recipes', () => {

    it('has a route handler listening to GET /api/recipes', async () => {

        const response = await request(app).get('/api/recipes').send();
        expect(response.status).not.toEqual(404);
    });

    it('can fetch a list of recipes', async () => {

        await createRecipe(RECIPES[0]);
        await createRecipe(RECIPES[1]);
        await createRecipe(RECIPES[2]);

        const response = await request(app).get('/api/recipes').send().expect(200);

        expect(response.body.length).toEqual(3);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.body.forEach((recipe: any, i: number) => {
            expect(recipe.name).toBe(RECIPES[i].name);
            expect(recipe.description).toEqual(RECIPES[i].description);
            expect(recipe.categories).toEqual(RECIPES[i].categories);
            expect(recipe.ingredients).toEqual(RECIPES[i].ingredients);
            expect(recipe.duration).toEqual(RECIPES[i].duration);
            expect(recipe.id).toBeDefined();
            expect(recipe._id).not.toBeDefined();

        });
    });
});