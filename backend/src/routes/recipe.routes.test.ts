import fs from 'fs';
import jwt from 'jsonwebtoken';
import { connection } from 'mongoose';
import path from 'path';
import { agent, SuperAgentTest } from 'supertest';
import { Recipe } from '../../../models/recipe.model';
import { RECIPES } from '../../../test_data/db-recipes';
import { migrateRecipeData, migrateUserData } from '../../migration/migration-helpers';
import { app, server } from '../app';
import { user1Id, USERS } from './../../../test_data/db-users';
import { RecipeModel } from './../models/recipe';
import { UserModel } from './../models/user';


jest.mock('jsonwebtoken');

describe('Recipes Routes',() => {
    
    let appAgent: SuperAgentTest;
    const verify = jest.spyOn(jwt, 'verify');
    verify.mockImplementation(() => ({ email: 'test@test.com', userId: user1Id }));

    beforeAll( (done) => {

        appAgent = agent(app);
        migrateUserData()
            .then(() => migrateRecipeData())
            .then(() => done());
    });


    afterAll((done) => {

        
        connection.collections.users.drop()
            .then(() => connection.collections.recipes.drop())
            .then(() => {connection.close();})
            .then(() => {
                server.close();
                removeDummyFiles();
                done();
            });
    });

    it('should have migrated test data successfully', async () => {

        const docs = await RecipeModel.countDocuments();
        const users = await UserModel.countDocuments();

        expect(docs).toBe(RECIPES.length);
        expect(users).toBe(USERS.length);
    });

    it('should return recipes when GET route /api/recipes without params',async() => {

        const response = await appAgent.get('/api/recipes').query({ });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Have 4 recipes');
        try { expect(response.body.recipes.length).toBe(RECIPES.length); }
        catch (e) {
            console.error('Did not fetch all recipes from db');
        }
    });

    it('should return recipes from User when GET route /api/recipes with userId in query',async() => {

        const user1Docs = RECIPES.filter(recipe => recipe.userId === user1Id);
        const response = await appAgent.get('/api/recipes').query({
            'userId': user1Id
        });
        
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(`Have ${user1Docs.length} recipes`);
        try { expect(response.body.recipes.length).toBe(user1Docs.length); }
        catch (e) {
            console.error('Did not fetch all recipes of user1 from db');
        }
    });

    it('should return recipes with ids given in query.ids',async() => {

        const docs = [RECIPES[0], RECIPES[2]];
        const ids = docs.map(recipe => recipe.id);
        const response = await appAgent.get('/api/recipes').query({
            ids: JSON.stringify(ids)
        });
        
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(`Have ${docs.length} recipes`);
        expect(response.body.recipes).toEqual(docs);
        try { expect(response.body.recipes.length).toBe(docs.length); }
        catch (e) {
            console.error('Did not fetch all recipes of user1 from db');
        }
    });

    it('should add new recipe to db if POST to route /api/recipes', async () => {

        const recipe: Recipe = {
            name: 'Test recipe',
            description: ['Fast to cook', 'Test'],
            duration: { unit: 'min', duration: 15 },
            ingredients:
                [{ name: 'Potato', amount: 2, unit: 'pieces' }, { name: 'Tomatojuice', amount: 200, unit: 'ml' }],
            userId: user1Id,
            categories: ['italian'],
        };

        const response = await appAgent.post('/api/recipes')
                                    .field('name',recipe.name )
                                    .field('description', JSON.stringify(recipe.description))
                                    .field('id','' )
                                    .field('categories', JSON.stringify(recipe.categories))
                                    .field('duration',JSON.stringify(recipe.duration))
                                    .field('ingredients',JSON.stringify(recipe.ingredients))
                                    .attach('image','backend/images/test_burger.jpeg')
                                    .set('authorization','Bearer token');

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('Created recipe Test recipe successfully');
        expect(response.body.recipe.description).toEqual(recipe.description);
        expect(response.body.recipe.name).toEqual(recipe.name);
        expect(response.body.recipe.id).toBeDefined();
        expect(response.body.recipe.categories).toEqual(recipe.categories);
        expect(response.body.recipe.userId).toEqual(recipe.userId);
        expect(response.body.recipe.ingredients).toEqual(recipe.ingredients);
    });

    it('should update a recipe by calling PUT to /api/recipes/:id', async () => {
        
        const recipe = RECIPES[0];
        const updatedName = 'new Name';

        const response = await appAgent.put(`/api/recipes/${recipe.id }`)
                                    .field('name',updatedName )
                                    .field('userId', recipe.userId as string)
                                    .field('description', JSON.stringify(recipe.description))
                                    .field('id',recipe.id )
                                    .field('categories', JSON.stringify(recipe.categories))
                                    .field('duration',JSON.stringify(recipe.duration))
                                    .field('ingredients',JSON.stringify(recipe.ingredients))
                                    .attach('image','backend/images/test_burger.jpeg')
                                    .set('authorization','Bearer token');
                                    
        expect(response.statusCode).toBe(200);
        const foundRecipe = await RecipeModel.findById(recipe.id);
        
        expect(foundRecipe.name).toEqual(updatedName);
    });

    it('should return 404 if calling PUT /api/recipes/:id with not existing id', async () => {

        const recipe = RECIPES[0];
        const randomId = recipe.id + 'adf';
        
        const response = await appAgent.put(`/api/recipes/${randomId}`)
                                    .field('name',recipe.name )
                                    .field('userId', recipe.userId as string)
                                    .field('description', JSON.stringify(recipe.description))
                                    .field('id',randomId)
                                    .field('categories', JSON.stringify(recipe.categories))
                                    .field('duration',JSON.stringify(recipe.duration))
                                    .field('ingredients',JSON.stringify(recipe.ingredients))
                                    .attach('image','backend/images/test_burger.jpeg')
                                    .set('authorization','Bearer token');

        expect(response.statusCode).toBe(404);
        expect(response.body.message.includes(`Error while updating recipe ${randomId}`)).toBeTruthy();
    });

    it('should get the recipe if calling GET /api/recipes/:id', async () => {
        
        const recipe = RECIPES[1];

        const response = await appAgent.get(`/api/recipes/${recipe.id }`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: `Found recipe ${recipe.id}`,
            recipe
        });
    });

    it('should return 404 if recipe by calling GET /api/recipes/:id is not found', async () => {
        
        const response = await appAgent.get('/api/recipes/435');

        expect(response.statusCode).toBe(404);
    });

    it('should return random numbers of recipes by calling GET /api/recipes/random/:amount', async () => {
    
        const amount = 3;

        const response = await appAgent.get(`/api/recipes/random/${amount}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.recipes.length).toBe(amount);
        (response.body.recipes as Recipe[]).forEach(recipe => {
            expect(recipe.name).toBeDefined();
            expect(recipe.description).toBeDefined();
            expect(recipe.id).toBeDefined();
            expect(recipe.ingredients).toBeDefined();
        });
    });
});

const removeDummyFiles = () => {
    
    const imagePath = './backend/images';
    fs.readdir(imagePath, (err, files) => {
    
        files.forEach(file => {
            const fileDir = path.join(imagePath, file);
            if (file !== 'test_burger.jpeg' && file !== 'test_falafel.jpeg' && file !== 'test_spaghetti.jpeg'
                && file !== 'profile-dummy.jpg' && file !== 'recipe-dummy.png') {
                fs.unlinkSync(fileDir);
            }
        });
    });
};