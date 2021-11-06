import { createRequest, createResponse } from 'node-mocks-http';
import { Recipe, RecipeStrings } from '../../../../models/recipe.model';
import { RECIPES } from '../../../../test_data/db-recipes';
import { user1Id } from '../../../../test_data/db-users';
import { RecipeModel } from '../../models/recipe';
import { deleteRecipe, getRandomRecipes, getRecipe, getRecipes, postRecipe, putRecipe } from './recipes.controller';


jest.mock('../../models/recipe');


jest.spyOn(RecipeModel, 'find');
jest.spyOn(RecipeModel, 'create');
jest.spyOn(RecipeModel, 'updateOne');
jest.spyOn(RecipeModel, 'findById');
jest.spyOn(RecipeModel, 'findByIdAndRemove');

(RecipeModel.findById as jest.Mock).mockReturnValue(Promise.resolve(RECIPES[0]));

describe('Recipes Controller', () => {

    let req, res, _next;
    beforeEach(() => {
        req = createRequest();
        res = createResponse();
        _next = null;
    });
    
    it('should call RecipeModel.find with req params when calling getRecipes', async () => {
        
        (RecipeModel.find as jest.Mock).mockReturnValue(Promise.resolve(RECIPES));
        const query = { userId: '2' };
        req.query = query;
        await getRecipes(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(RecipeModel.find).toBeCalledWith(query);
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
            userId: '',
            categories: ['italian'],
            image: '',
        };
        const recipeStrings: RecipeStrings = {
            name: recipe.name,
            id: recipe.id,
            description: JSON.stringify(recipe.description),
            duration: JSON.stringify(recipe.duration),
            ingredients: JSON.stringify(recipe.ingredients),
            categories: JSON.stringify(recipe.categories),
            userId: '',
            image: recipe.image
        };
          
        (RecipeModel.create as jest.Mock).mockReturnValue(Promise.resolve());
        req.body = recipeStrings;
        req.userData = { userId: user1Id, email: 't@test.com' };

        await postRecipe(req, res);

        expect(RecipeModel.create).toBeCalledWith({ ...recipe, userId: user1Id });
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
            userId: recipe.userId as string,
            image: recipe.image
        };
        const newName = 'Test name';
        (RecipeModel.updateOne as jest.Mock).mockReturnValue(Promise.resolve({
            message: 'ahhelo',
            recipe: { ...recipe, name: newName }
        }));
        req.params.id = recipe.id;
        req.body = recipeStrings;
        req.userData = { userId: recipe.userId as string };

        await putRecipe(req, res);

        expect(RecipeModel.updateOne).toBeCalledWith({ _id: recipe.id, userId: recipe.userId as string }, recipe );
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should call findByIdAndRemove when calling deleteRecipe',async () => {

        (RecipeModel.findByIdAndRemove as jest.Mock).mockReturnValue(Promise.resolve({ message: 'Deleted recipe' }));
        const recipe = RECIPES[0];
        req.body.id = recipe.id;

        await deleteRecipe(req, res);

        expect(RecipeModel.findByIdAndRemove).toBeCalledWith( recipe.id);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
    });
});