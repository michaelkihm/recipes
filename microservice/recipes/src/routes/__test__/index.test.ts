import request from 'supertest';
import { app } from '../../app';
import { RecipeDoc, RecipeModel } from '../../models/recipe.model';
import { NEW_RECIPES, user1Id } from './data/dummy-new-recipes';
import { createRecipe } from './shared/create-recipe';


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

    it('Returns recipes from user if userId is a provided query param',async () => {

        const recipes: RecipeDoc[] = [];
        NEW_RECIPES.forEach(recipe => recipes.push(RecipeModel.build(recipe)));
        const user1Recipes = NEW_RECIPES.filter(recipe => recipe.userId === user1Id);
        await RecipeModel.collection.insertMany(recipes);

        const response = await request(app)
                            .get('/api/recipes')
                            .query({ userId: user1Id })
                            .send().expect(200);
        
        expect(response.body.length).toBe(user1Recipes.length);
        response.body.forEach((recipe: RecipeDoc) => {
            expect(user1Recipes.findIndex(r => r.name === recipe.name)).not.toBe(-1);
        });
    });

    it('Returns recipes queried by its ids in the query param', async () => {
        
        await RecipeModel.collection.insertMany(NEW_RECIPES.map(recipe => RecipeModel.build(recipe)));
        const recipes = await RecipeModel.find({});
        const [id1, id2, ..._rest] = recipes.map(recipe => recipe.id);
        const firstIds = [id1, id2];

        const response = await request(app)
                            .get('/api/recipes')
                            .query({ ids:  firstIds })
                            .send().expect(200);


        expect(response.body.length).toBe(firstIds.length);
        expect(firstIds).toContain(response.body[0].id);
        expect(firstIds).toContain(response.body[1].id);
        
    });
});