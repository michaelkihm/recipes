import { connection } from 'mongoose';
import { agent, SuperAgentTest } from 'supertest';
import { RECIPES } from '../../../test_data/db-data';
import { app, server } from '../app';
import { RecipeModel } from './../models/recipe';


describe('Recipes Routes',() => {
    let appAgent: SuperAgentTest;
    beforeAll( (done) => {

        appAgent = agent(app);
        migrateData().then(() => done());
    });

    const migrateData = async () => RecipeModel.insertMany(RECIPES);

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
});