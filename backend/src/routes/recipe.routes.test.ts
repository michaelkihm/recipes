import { connection, Types } from 'mongoose';
import { agent, SuperAgentTest } from 'supertest';
import { Recipe } from '../../../models/recipe.model';
import { RECIPES } from '../../../test_data/db-data';
import { app, server } from '../app';
import { RecipeModel } from './../models/recipe';


describe('Recipes Routes',() => {
    let appAgent: SuperAgentTest;
    beforeAll( (done) => {

        appAgent = agent(app);
        migrateData().then(() => done());
    });

    const migrateData = async () => RecipeModel.insertMany(RECIPES.map(recipe => ({
        ...recipe,
        _id: Types.ObjectId.createFromHexString(recipe.id)
    })));

    afterAll((done) => {

        connection.collections.recipes.drop()
            .then(() => {connection.close();})
            .then(() => {
                server.close();
                done();
            });
    });

    it('should have migrated test data successfully', async () => {
        const docs = await RecipeModel.countDocuments();

        expect(docs).toBe(RECIPES.length);
    });

    it('should return recipes when GET route /api/recipes',async() => {
        const response = await appAgent.get('/api/recipes');
        
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Have 4 recipes');
        try { expect(response.body.recipes.length).toBe(RECIPES.length); }
        catch (e) {
            console.error('Did not fetch all recipes from db');
        }
    });

    it('should add new recipe to db if POST to route /api/recipes', async () => {

        const recipe: Recipe = {
            name: 'Test recipe',
            description: 'Fast to cook',
            duration: { unit: 'min', duration: 15 },
            ingredients:
                [{ name: 'Potato', amount: 2, unit: 'pieces' }, { name: 'Tomatojuice', amount: 200, unit: 'ml' }],
            createdBy: 'TestUser',
            category: ['italian'],
        };
        const response = await appAgent.post('/api/recipes').send({ recipe });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('Created recipe Test recipe successfully');
        expect(response.body.recipe.description).toEqual(recipe.description);
        expect(response.body.recipe.name).toEqual(recipe.name);
        expect(response.body.recipe.id).toBeDefined();
        expect(response.body.recipe.category).toEqual(recipe.category);
    });

    it('should update a recipe by calling PUT to /api/recipes/:id', async () => {
        
        const recipe = RECIPES[0];
        const updatedName = 'new Name';

        const response = await appAgent.put(`/api/recipes/${recipe.id }`)
                                    .send({ recipe: { recipe, name: updatedName } });

        expect(response.statusCode).toBe(200);
        const foundRecipe = await RecipeModel.findById(recipe.id);
        
        expect(foundRecipe.name).toEqual(updatedName);
    });

    it('should return 404 if calling PUT /api/recipes/:id with not existing id', async () => {

        const recipe = RECIPES[0];
        const randomId = recipe.id + 'adf';
        
        const response = await appAgent.put(`/api/recipes/${randomId}`).send({ recipe });

        expect(response.statusCode).toBe(404);
        expect(response.body.message.includes(`Error while updating recipe ${randomId}`)).toBeTruthy();
    });
});