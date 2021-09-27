import { createRequest, createResponse } from 'node-mocks-http';
import { Recipe } from '../../../models/recipe.model';
import { RECIPES } from '../../../test_data/db-data';
import { RecipeModel } from '../models/recipe';
import { getRandomRecipes, getRecipe, getRecipes, postRecipe } from './recipes.controller';


jest.mock('../models/recipe');


jest.spyOn(RecipeModel, 'find');
jest.spyOn(RecipeModel, 'create');

describe('Recipes Controller', () => {

    let req, res, _next;
    beforeEach(() => {
        req = createRequest();
        res = createResponse();
        _next = null;
    });
    
    it('should return recipes with response 200 when calling getRecipes', () => {
        (RecipeModel.find as jest.Mock).mockReturnValue(RECIPES);
        
        getRecipes(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(RecipeModel.find).toBeCalledTimes(1);
        //expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return recipe with given id when calling getRecipe(id)',() => {

        const id = '2';
        const recipe = RECIPES.find(recipe => recipe.id === id);
        expect(recipe).toBeTruthy();
        req.params = { id };

        getRecipe(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            recipe,
            message: `Found recipe ${id}`
        });
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a 404 if getRecipe does not find a recipe with given id', () => {

        const id = '404';
        req.params = { id };

        getRecipe(req, res);
        
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return number of random recipes when calling getRandomRecipes(amount)', () => {

        const amount = '2';
        req.params = { amount };

        getRandomRecipes(req,res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().recipes.length).toBe(+amount);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should add a model by calling postRectipe',async () => {

        const recipe: Recipe = {
            name: 'Test recipe',
            description: 'Fast to cook',
            duration: { unit: 'min', duration: 15 },
            ingredients:
                [{ name: 'Potato', amount: 2, unit: 'pieces' }, { name: 'Tomatojuice', amount: 200, unit: 'ml' }],
            createdBy: 'TestUser',
            category: ['italian'],
            id: '9'
        };
        
        (RecipeModel.create as jest.Mock).mockReturnValue(Promise.resolve(recipe));
        req.body = { recipe };

        await postRecipe(req, res);

        expect(res.statusCode).toBe(201);
        expect(RecipeModel.create).toBeCalledWith(recipe);
        expect(res._getJSONData().recipe.name).toEqual(recipe.name);
        expect(res._getJSONData().message).toEqual('Created recipe Test recipe successfully');
        expect(res._isEndCalled()).toBeTruthy();
    });
});