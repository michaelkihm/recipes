import { createRequest, createResponse } from 'node-mocks-http';
import { RECIPES } from '../../../test_data/db-data';
import { getRandomRecipes, getRecipe, getRecipes } from './recipes.controller';

describe('Recipes Controller', () => {

    let req, res, _next;
    beforeEach(() => {
        req = createRequest();
        res = createResponse();
        _next = null;
    });
    
    it('should return recipes with response 200 when calling getRecipes', () => {

        getRecipes(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: `Have ${RECIPES.length} recipes`, recipes: RECIPES });
        expect(res._isEndCalled()).toBeTruthy();
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
});