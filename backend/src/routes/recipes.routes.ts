import { Router } from 'express';
import {
    getRandomRecipes, getRecipe, getRecipes, multerMiddleware, postRecipe
} from '../controllers/recipes.controller';
import { putRecipe } from './../controllers/recipes.controller';
import { checkAuth } from './../middleware/check-auth';

export const recipeRouter = Router();


recipeRouter.get('', getRecipes);

recipeRouter.post('', checkAuth,postRecipe);

recipeRouter.get('/random/:amount', getRandomRecipes);

recipeRouter.get('/:id',getRecipe);

recipeRouter.put('/:id',checkAuth,multerMiddleware, putRecipe);