import { BaseRecipe, Subjects } from '@mickenhosrecipes/common';
import request from 'supertest';
import { app } from '../../app';
import { RecipeModel } from '../../models/recipe.model';
import { natsWrapper } from '../../nats-wrapper';
import { NEW_RECIPES } from './data/dummy-new-recipes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postNewRecipe = (recipe: any) => {

    return request(app)
            .post('/api/recipes')
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

describe('Add recipes - /api/recipes', () => {

    beforeEach(() => jest.clearAllMocks());


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

        await postNewRecipe({ ...NEW_RECIPES[3], name: '' })
            .expect(400);
    });

    it('returns an error if an invalid recipe description is provided', async () => {

        await postNewRecipe({ ...NEW_RECIPES[3], description: '' })
            .expect(400);
    });


    it('returns an error if an invalid recipe duration is provided', async () => {

        await postNewRecipe({ ...NEW_RECIPES[3], duration: '' })
            .expect(400);
    });


    it('returns an error if an invalid recipe categories is provided', async () => {

        await postNewRecipe({ ...NEW_RECIPES[3], categories: '' })
            .expect(400);
    });


    it('returns an error if an invalid recipe ingredients is provided', async () => {

        await postNewRecipe({ ...NEW_RECIPES[3], ingredients: '' })
            .expect(400);
    });


    it('creates a recipe with valid inputs', async () => {

        const recipe: BaseRecipe = {
            name: 'Test recipe',
            description: ['Fast to cook'],
            duration: { unit: 'min', duration: 15 },
            ingredients:
                [{ name: 'Potato', amount: 2, unit: 'pieces' }, { name: 'Tomatojuice', amount: 200, unit: 'ml' }],
            userId: '',
            categories: ['italian'],
            image: 'images/salmon-g856c1740c_640.jpg',
        };
        const imageBaseURL = '/api/recipes/images/';

        let recipes = await RecipeModel.find({});
        expect(recipes.length).toEqual(0);

        await postNewRecipe(recipe)
            .expect(201);

        recipes = await RecipeModel.find({});

        const image = recipes[0].image;
        expect(recipes.length).toEqual(1);
        expect(recipes[0].name).toEqual(recipe.name);
        expect([...recipes[0].description]).toEqual(recipe.description);
        expect(recipes[0].userId).toBeDefined();
        expect(image).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(image!.substring(0,imageBaseURL.length)).toEqual(imageBaseURL);
        expect(recipes[0].duration).toEqual(recipe.duration);
        expect([...recipes[0].categories]).toEqual(recipe.categories);
        recipes[0].ingredients.forEach((ingredient, i) => {
            expect(ingredient.name).toEqual(recipe.ingredients[i].name);
            expect(ingredient.amount).toEqual(recipe.ingredients[i].amount);
            expect(ingredient.unit).toEqual(recipe.ingredients[i].unit);
        });
    });

    it('adds the default image if image is not given', async () => {

        const recipe: BaseRecipe = {
            name: 'Test recipe',
            description: ['Fast to cook'],
            duration: { unit: 'min', duration: 15 },
            ingredients:
                [{ name: 'Potato', amount: 2, unit: 'pieces' }, { name: 'Tomatojuice', amount: 200, unit: 'ml' }],
            userId: '',
            categories: ['italian'],
            image: '',
        };

        await postNewRecipe(recipe)
            .expect(201);

        const recipes = await RecipeModel.find({});

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(recipes[0].image!.includes('recipe-dummy')).toBeTruthy();

    });

    it('publishes an event if new recipe gets created', async () => {

        const recipe = NEW_RECIPES[0];
        await postNewRecipe(recipe)
            .expect(201);
 
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});