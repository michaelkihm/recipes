import { Router } from 'express';
import {
    getRandomRecipes, getRecipe, getRecipes, multerMiddleware, postRecipe
} from '../controllers/recipes.controller';
import { putRecipe } from './../controllers/recipes.controller';

export const recipeRouter = Router();


recipeRouter.get('', getRecipes);

recipeRouter.post('', postRecipe);

recipeRouter.get('/random/:amount', getRandomRecipes);

recipeRouter.get('/:id',getRecipe);

recipeRouter.put('/:id',multerMiddleware, putRecipe);