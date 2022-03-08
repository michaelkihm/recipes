import request from 'supertest';
import { app } from '../../app';
import { RecipeDoc, RecipeModel } from '../../models/recipe.model';
import { NEW_RECIPES, user1Id } from './data/dummy-new-recipes';
import { createRecipe } from './shared/create-recipe';

const writeTestRecipesToDb = () => RecipeModel.insertMany(
    NEW_RECIPES.map(recipe => RecipeModel.build(recipe))
);


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

        await writeTestRecipesToDb();
        const user1Recipes = NEW_RECIPES.filter(recipe => recipe.userId === user1Id);
    

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
        
        await writeTestRecipesToDb();
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

    it('Returns recipes with categories given in query param categories', async () => {

        await writeTestRecipesToDb();

        // query vegan recipes
        const veganRecipes = NEW_RECIPES.filter(recipe => recipe.categories.includes('vegan'));

        const response = await request(app)
                            .get('/api/recipes')
                            .query({ categories:  ['vegan'] })
                            .send().expect(200);

        expect(response.body.length).toBe(veganRecipes.length);

        // query for italian and healthy
        const healthyItalianRecipes = NEW_RECIPES.filter(recipe =>
            recipe.categories.includes('healthy') && recipe.categories.includes('italian'));
        
        const response2 = await request(app)
            .get('/api/recipes')
            .query({ categories:  ['healthy', 'italian'] })
            .send().expect(200);

        expect(response2.body.length).toBe(healthyItalianRecipes.length);
    });

    it('Can by searched by text if searchString is given in query param', async () => {

        await writeTestRecipesToDb();
        let searchString = 'Burger';
        const response = await request(app)
            .get('/api/recipes')
            .query({ searchString })
            .send().expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe(searchString);

        // search for magna eget
        searchString = 'magna eget';
        const response2 = await request(app)
            .get('/api/recipes')
            .query({ searchString })
            .send().expect(200);

        expect(response2.body.length).toBe(2);
        expect(['Rezept', 'Spaghetti aglio']).toContain(response2.body[0].name);
        expect(['Rezept', 'Spaghetti aglio']).toContain(response2.body[1].name);
       
    });
});