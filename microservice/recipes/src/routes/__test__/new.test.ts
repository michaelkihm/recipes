import request from 'supertest';
import { app } from '../../app';
import { RecipeModel } from '../../models/recipe.model';
import { RECIPES } from './dummy-recipes';


describe('Add recipes - /api/recipes', () => {

    it('has a route handler listening to POST /api/recipes', async () => {

        const response = await request(app).post('/api/recipes').send({});
        expect(response.status).not.toEqual(404);
    });


    it('can only be accessed if the user is signed in', async () => {

        await request(app).post('/api/recipes').send({}).expect(401);
    });


    it('returns a status other than 401 if the user is signed in', async () => {
        const response = await request(app)
          .post('/api/recipes')
          .set('Cookie', global.signin())
          .send({});
      
        expect(response.status).not.toEqual(401);
    });


    it('returns an error if an invalid recipe name is provided', async () => {

        await request(app)
            .post('/api/recipes')
            .set('Cookie', global.signin())
            .send({
                ...RECIPES[0],
                name: ''
            })
            .expect(400);
    });

    it('returns an error if an invalid recipe description is provided', async () => {

        await request(app)
            .post('/api/recipes')
            .set('Cookie', global.signin())
            .send({
                ...RECIPES[0],
                description: ''
            })
            .expect(400);
    });


    it('returns an error if an invalid recipe duration is provided', async () => {

        await request(app)
            .post('/api/recipes')
            .set('Cookie', global.signin())
            .send({
                ...RECIPES[0],
                duration: ''
            })
            .expect(400);
    });


    it('returns an error if an invalid recipe categories is provided', async () => {

        await request(app)
            .post('/api/recipes')
            .set('Cookie', global.signin())
            .send({
                ...RECIPES[0],
                categories: ''
            })
            .expect(400);
    });


    it('returns an error if an invalid recipe ingredients is provided', async () => {

        await request(app)
            .post('/api/recipes')
            .set('Cookie', global.signin())
            .send({
                ...RECIPES[0],
                ingredients: ''
            })
            .expect(400);
    });


    it('creates a ticket with valid inputs', async () => {

        let recipes = await RecipeModel.find({});
        expect(recipes.length).toEqual(0);

        await request(app)
            .post('/api/recipes')
            .set('Cookie', global.signin())
            .send(RECIPES[0])
            .expect(201);

        recipes = await RecipeModel.find({});

        expect(recipes.length).toEqual(1);
        expect(recipes[0].name).toEqual(RECIPES[0].name);
        expect([...recipes[0].description]).toEqual(RECIPES[0].description);
        expect(recipes[0].userId).toBeDefined();
        expect(recipes[0].duration).toEqual(RECIPES[0].duration);
        expect([...recipes[0].categories]).toEqual(RECIPES[0].categories);
        recipes[0].ingredients.forEach((ingredient, i) => {
            expect(ingredient.name).toEqual(RECIPES[0].ingredients[i].name);
            expect(ingredient.amount).toEqual(RECIPES[0].ingredients[i].amount);
            expect(ingredient.unit).toEqual(RECIPES[0].ingredients[i].unit);
        });

    });
});

