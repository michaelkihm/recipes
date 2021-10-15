import { createRequest, createResponse } from 'node-mocks-http';
import { Recipe, RecipeStrings } from '../../../models/recipe.model';
import { RECIPES } from '../../../test_data/db-data';
import { RecipeModel } from '../models/recipe';
import { getRandomRecipes, getRecipe, getRecipes, postRecipe, putRecipe } from './recipes.controller';


jest.mock('../models/recipe');


jest.spyOn(RecipeModel, 'find');
jest.spyOn(RecipeModel, 'create');
jest.spyOn(RecipeModel, 'updateOne');
jest.spyOn(RecipeModel, 'findById');

(RecipeModel.findById as jest.Mock).mockReturnValue(Promise.resolve(RECIPES[0]));

describe('Recipes Controller', () => {

    let req, res, _next;
    beforeEach(() => {
        req = createRequest();
        res = createResponse();
        _next = null;
    });
    
    it('should return recipes with response 200 when calling getRecipes', async () => {
        
        (RecipeModel.find as jest.Mock).mockReturnValue(Promise.resolve(RECIPES));
        
        await getRecipes(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(RecipeModel.find).toBeCalledTimes(1);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return recipe with given id when calling getRecipe(id)', async () => {
  
        const recipe = RECIPES[0];
        
        req.params = { id: recipe.id };

        await getRecipe(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(RecipeModel.findById).toBeCalledWith(recipe.id);
        expect(res._isEndCalled()).toBeTruthy();
    });

    
    it('should return number of random recipes when calling getRandomRecipes(amount)', async () => {

        const amount = '2';
        req.params = { amount };

        await getRandomRecipes(req,res);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should add a recipe by calling postRectipe',async () => {

        const recipe: Recipe = {
            name: 'Test recipe',
            description: ['Fast to cook'],
            duration: { unit: 'min', duration: 15 },
            ingredients:
                [{ name: 'Potato', amount: 2, unit: 'pieces' }, { name: 'Tomatojuice', amount: 200, unit: 'ml' }],
            createdBy: 'TestUser',
            categories: ['italian'],
        };
        
        (RecipeModel.create as jest.Mock).mockReturnValue(Promise.resolve());
        req.body = { recipe };

        await postRecipe(req, res);

        expect(res.statusCode).toBe(201);
        expect(RecipeModel.create).toBeCalledWith(recipe);
        await expect(RecipeModel.create).toBeCalledTimes(1);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should update a recipe by calling putRecipe',async () => {
        
        const recipe = RECIPES[0];
        const recipeStrings: RecipeStrings = {
            name: recipe.name,
            id: recipe.id,
            description: JSON.stringify(recipe.description),
            duration: JSON.stringify(recipe.duration),
            ingredients: JSON.stringify(recipe.ingredients),
            categories: JSON.stringify(recipe.categories),
            createdBy: recipe.createdBy,
            image: recipe.image
        };
        const newName = 'Test name';
        (RecipeModel.updateOne as jest.Mock).mockReturnValue(Promise.resolve({
            message: 'ahhelo',
            recipe: { ...recipe, name: newName }
        }));
        req.params.id = recipe.id;
        req.body = recipeStrings;

        await putRecipe(req, res);

        expect(res.statusCode).toBe(200);
        expect(RecipeModel.updateOne).toBeCalledWith({ _id: recipe.id }, recipe );
        expect(res._isEndCalled()).toBeTruthy();
    });
});